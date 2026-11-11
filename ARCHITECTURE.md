# Teknik Altyapı

Bağımlılıksız, derleme adımı olmayan statik site. Vanilla HTML + CSS + ES modules.

Çalıştırma: ES modules ve `main.js` içindeki top-level `await` yüzünden `file://` ile açılmaz. Klasörde yerel sunucu gerekir (`python -m http.server`). GitHub Pages / Netlify'da doğrudan çalışır.

---

## 1. Klasör yapısı

```
index.html
assets/
  flags/
    en.svg
    tr.svg
css/
  base.css          değişkenler (renk, font, ölçü), açık/koyu tema, reset, tipografi
  layout.css        container, sabit header, nav, dil bayrakları + tema butonu, bölümler, footer, mobil header
  components.css    buton, ilerleme çubuğu, kayar sorular, seçenekler, kazı-kazan
js/
  main.js           giriş noktası, modülleri bağlar, seçili testi yönetir
  config.js         dilden bağımsız ayarlar (AUTHOR, TESTS, DEFAULT_TEST, STATS)
  i18n.js           çeviri motoru
  languages.js      dil kaydı (LANGUAGES, DEFAULT_LANG)
  langswitch.js     header bayrak butonları
  theme.js          tema (açık/koyu), header tema butonu, seçimi saklama
  testswitch.js     test seçici butonları (tek test varsa gizli)
  site.js           footer render
  nav.js            scroll ile menü vurgusu
  share.js          WhatsApp linki
  stats.js          sayaç: Worker'a sayım + sayıları okuma, GoatCounter'a arka plan sayımı
  richtext.js       alıntılı metin ([@anahtar]), kaynak listesi
  references.js     kaynak kayıtları (REFERENCES)
  quiz.js           adım adım test (birden fazla testi taşır)
  result.js         sonuç paneli, PDF özeti
  scratch.js        kazı-kazan canvas
  scoring.js        skor hesabı (DOM'suz)
  locales/
    en.js           varsayılan dil, tüm metinler
    tr.js
worker/             sayaç Worker'ı (siteden ayrı yayınlanır, Cloudflare Workers + D1)
  src/index.js      API
  schema.sql        D1 tablosu
  wrangler.toml     Worker ayarı (izinli siteler, D1 bağlantısı)
  README.md         yayınlama adımları
```

CSS yükleme sırası (`index.html`): `base` → `background` → `layout` → `components` → .

---

## 2. Modül bağımlılıkları

```
main.js
 ├─ config.js            (TESTS, DEFAULT_TEST)
 ├─ i18n.js ──────────── languages.js ──(dynamic import)── locales/*.js
 ├─ langswitch.js ────── languages.js, i18n.js
 ├─ theme.js ─────────── i18n.js
 ├─ testswitch.js ────── i18n.js
 ├─ site.js ──────────── config.js (AUTHOR), i18n.js, stats.js (sadece statsEnabled)
 ├─ share.js ─────────── i18n.js
 ├─ stats.js ─────────── config.js (STATS), i18n.js
 ├─ richtext.js ──────── references.js, i18n.js
 ├─ quiz.js ──────────── i18n.js          (testler main.js'ten parametre olarak gelir)
 └─ result.js ────────── config.js (TESTS)
                          scoring.js     (config'e bağımlı değil, scoring nesnesi parametre)
                          i18n.js
                          scratch.js   (bağımsız)
```

Başlatma sırası (`main.js`):

1. `await initI18n()`
2. `initLangSwitch()`, `initTheme()`, `initSite()`, `initNav()`, `initShare()`, `initRichText()`
3. `initStats()` (beklenmez, sayılar gelince kutu kendi açılır)
4. `createResult({...})`
5. `createQuiz({ tests: TESTS, initialTest: DEFAULT_TEST, ... })`; `onFinish(answers, id)` içinde `finished.set`, `trackTestCompleted(id)`, sonra `result.show(answers, id)`
6. `initTestSwitch({...})`, `renderTestMeta()`

`createResult` içindeki `onEdit` / `onRestart` callback'leri `quiz` değişkenine, `createQuiz` içindeki `onFinish` ise `result` değişkenine referans verir. İkisi de çağrıldıkları anda tanımlıdır.

---

## 3. i18n

### Dosyalar
- `languages.js`: `DEFAULT_LANG`, `LANGUAGES = [{ code, name, flag, load }]`. `load` dinamik `import()` döndürür.
- `locales/<kod>.js`: `export default { ... }` tek obje.
- `i18n.js` dışa aktarır: `initI18n`, `setLang(code, {persist})`, `t(path, vars)`, `get(path)`, `getLang()`, `onLangChange(fn)`.

### Dil seçim önceliği (`initI18n`)
1. URL `?lang=`
2. `localStorage["lang"]` (try/catch içinde; yalnızca kullanıcı bayrağa tıklayınca yazılır)
3. Tarayıcı dili: `navigator.languages` sırasıyla, bölge kodu atılarak (`tr-TR` → `tr`), `LANGUAGES`'ta kayıtlı ilk eşleşme (`fromBrowser`)
4. `DEFAULT_LANG`

Açılışta hiçbir şey kaydedilmez (`setLang(..., { persist: false })`). Tarayıcı dilinden gelen seçim saklanmadığı için tarayıcı dili sonradan değişirse site de uyar. Yeni dil eklenince tarayıcı eşlemesi otomatik çalışır, ek kod gerekmez.

### Çalışma şekli
- Seçili dil sözlüğü `dict`, varsayılan dil `fallback`. `get(path)` önce `dict`'e, bulamazsa `fallback`'e bakar. Eksik çeviri varsayılana düşer.
- `t(path, vars)` string döndürür, `{n}` biçimindeki yer tutucuları `vars` ile doldurur. Anahtar yoksa path'i döndürür.
- Path noktalı: `tests.sns.messages.suspect.title`, `tests.sns.questions.0`.
- `setLang` içinde `seq` sayacı var: arka arkaya iki dil seçilirse sadece sonuncusu uygulanır. Yükleme hatasında konsola yazar, mevcut dil kalır.
- Dil uygulanınca sırayla: `<html lang>`, `document.title`, meta description, `[data-i18n]` ve `[data-i18n-aria-label]` elemanları, sonra `onLangChange` dinleyicileri.

### Dil değişince tetiklenen dinleyiciler (kayıt sırasıyla)
| Modül | Fonksiyon | Yaptığı |
|---|---|---|
| `langswitch.js` | `mark` | `aria-pressed` günceller |
| `theme.js` | `label` | tema butonunun `title`'ını yeni dilde yazar |
| `site.js` | `renderFooter` | footer'ı yeniden çizer |
| `share.js` | `update` | link `href`'ini yeniden kurar |
| `richtext.js` | `renderAll` | Hakkımda ve Narkolepsi metinlerini, alıntı numaralarını ve kaynak listelerini yeniden çizer |
| `stats.js` | `render` | sayıları yeni dilin biçimiyle yazar (yalnızca sayaç açıksa kayıtlı) |
| `result.js` | `render` | mesaj  + kapak yazısı (gösterilen testin metinleriyle) |
| `quiz.js` | `refreshText` | aktif testin soru ve seçenek metinleri, ilerleme, buton etiketi, ipucu |
| `testswitch.js` | `paint` | test butonlarının etiketleri |
| `main.js` | `renderTestMeta` | seçili testin alt başlığı, yönergesi ve telif satırı |

### Dil dosyası anahtar ağacı
```
meta         title, description, dateLocale
site         name
nav          aria, home, about, narcolepsy, test
lang         label
theme        toggle   (tema butonunun aria-label ve title'ı)
refs         title, cite({n})
home         tagline, start, views, tests
about        lead, big, p1, p2
narcolepsy   title, body[]   (paragraf dizisi; "## " ile başlayan satır h3, [@anahtar] alıntı)
test         title, switchLabel, progress({n},{total}), prev, next, finish, tip({min},{max})   (testlerin ortak arayüz metinleri)
tests.<id>   name, subtitle, [intro[]], questions[], scale[], messages,  [copyright]     (her test için bir blok; köşeli olanlar isteğe bağlı)
               messages.<anahtar> → { title, body }; anahtarlar scoring tipine göre:
                 threshold biçimi : suspect | unlikely | neutral
                 bands biçimi     : bands[].key değerleri (+ "neutral")
               intro[]   → sorulardan önce gösterilen yönerge paragrafları (yoksa gösterilmez)
               copyright → test panelinin altında ve gösterilen telif/lisans satırı (yoksa gösterilmez)
result       cover, hint, skip, edit, restart, score({score},{max})
share        button, text
footer       role, note, statsNote   (statsNote yalnızca sayaç açıkken gösterilir)
```

HTML'e `data-i18n` ile bağlananlar: `site.name`, `nav.*`, `home.*`, `narcolepsy.title`, `test.title`, `test.switchLabel` (aria-label), `theme.toggle` (aria-label), `test.prev`, `result.hint`, `result.skip`,  `result.edit`, `result.restart`, `share.button`.

JS ile çizilenler: `about.*` (lead, big, p1, p2) ve `narcolepsy.body` (`richtext.js`, `data-i18n-rich*` ile bağlı), `refs.*`, `tests.<id>.*` (soru, seçenek, alt başlık, ad, mesaj), `test.progress`, `test.next`, `test.finish`, `test.tip` (`{min}`/`{max}` içerdiği için `data-i18n` ile bağlanamaz, `quiz.js` yazar), `result.score`, `tests.<id>.intro` ve `tests.<id>.copyright` (`main.js`), `meta.dateLocale`, `footer.*`, `share.text`, `result.cover`, `theme.toggle` (butonun `title`'ı, `theme.js`).

### Tutarlılık kuralları
- ESS gibi lisanslı bir testin yönerge (`intro`), madde (`questions`), seçenek (`scale`) ve `copyright` metinleri lisanslı kaynaktan birebir alınır, düzenlenmez. Bant başlıkları yazarın yorum adlarıdır. Bant gövde metinleri (`messages.*.body`)  bize aittir.
- Her test için `config.js > TESTS[id].questionCount` = `tests.<id>.questions.length`, `scaleSize` = `tests.<id>.scale.length` (her dil dosyasında).
- `TESTS[id].scoring.weights.length` = `questionCount`.
- `scoring.bands` kullanılıyorsa her `key` için `tests.<id>.messages.<key>` bulunmalı (ve `neutral`, skor hiçbir banda düşmezse).
- `index.html` içindeki `data-i18n` elemanlarında İngilizce yedek metin de durur (JS yüklenmeden / JS kapalıyken görünür). İngilizce metin değişirse hem `locales/en.js` hem `index.html` güncellenir (tema butonunun `aria-label` ve `title` yedeği dahil). `#test-subtitle` ve `#quiz-tip` JS ile yazıldığı için HTML'de yalnızca varsayılan testin İngilizce yedeği durur.

---

## 4. HTML kancaları (`index.html`)

JS'in bağlandığı id ve attribute'lar:

| Seçici | Kullanan |
|---|---|
| `#lang-list` | `langswitch.js` (bayraklar buraya basılır) |
| `#theme-btn` | `theme.js` (varsayılan `hidden`, `initTheme` açar) |
| `#footer` | `site.js` |
| `.site-nav a[href="#..."]`, `#about`, `#narcolepsy`, `#test` | |
| `[data-share-whatsapp]` | `share.js` |
| `#stats`, `#stat-views`, `#stat-tests` | `stats.js` (`#stats` varsayılan `hidden`) |
| `[data-rich-block]`, `[data-i18n-rich]`, `[data-i18n-rich-list]`, `[data-refs]` | `richtext.js` |
| `#test-title` | `main.js` (`scrollToTest`) |
| `#test-switch` | `testswitch.js` (butonlar buraya basılır, varsayılan `hidden`, tek test varsa hep gizli) |
| `#test-subtitle` | `main.js` (`renderTestMeta`) |
| `#test-intro` | `main.js` (`renderTestMeta`), `#quiz-panel` içinde, yönergesi olmayan testte `hidden` |
| `#test-copyright` | `main.js` (`renderTestMeta`), test panellerinin altında (sonuç ekranında da görünür), telif satırı olmayan testte `hidden` |
| `#quiz-panel`, `#quiz-viewport`, `#quiz-track`, `#prev-btn`, `#next-btn`, `#quiz-tip` | `quiz.js` |
| `#progress-text`, `#progress-fill`, `#progress-bar` | `quiz.js` |
| `#result-panel`, `#result-content`, `#scratch`, `#scratch-hint`, `#skip-scratch`, `#result-actions` | `result.js` |
| `#edit-btn`, `#restart-btn`,  | `result.js` |
| `#bg` | arka plan katmanı (JS bağlı değil) |

Header'ın sağ tarafı `.header-tools` içindedir: `#lang-list` + `#theme-btn`. Sarmalayıcı mobil grid düzeninde (`layout.css`, `36rem` altı) bu ikisini tek hücre yapar.

`<head>` içinde, CSS'ten önce küçük bir satır içi script vardır: `localStorage["theme"]` `"dark"` ya da `"light"` ise `<html data-theme>` olarak uygular (açılışta renk çakmasını önler). `theme.js` ile aynı anahtarı okur, anahtar adı iki yerde elle senkron.

Bölüm id'leri: `home`, `about`, `narcolepsy`, `test`. Menü linkleri bunlara `href` ile gider. `.brand` linki `#home`'a gider. Sayfadaki tek `<h1>` Home bölümündeki başlıktır, diğer bölüm başlıkları `<h2>`.

---

## 5. Test akışı

### Veri nerede durur (testler birbirinden ayrı)
| Ne | Test başına ayrı yer |
|---|---|
| Tanım (soru/seçenek sayısı, skorlama, `keyBase`, `showScore`) | `config.js > TESTS[id]` |
| Metinler | `locales/*.js > tests.<id>` |
| Cevaplar ve kalınan soru | `quiz.js` içinde `store` (id → `{ answers, index }`), yalnızca bellekte |
| Bitirilmiş durum | `main.js > finished` (id → cevaplar), yalnızca bellekte |
| Tamamlanma sayacı | Worker'da `test_<id>`, GoatCounter'da `/test-completed/<id>` |

Cevaplar hiçbir yere gönderilmez ve saklanmaz. Sayfa yenilenince bellekteki her şey sıfırlanır. Cihazda yalnızca dil ve tema tercihi saklanır (`localStorage["lang"]`, `localStorage["theme"]`), ve yalnızca kullanıcı bayrağa ya da tema butonuna tıklayınca.

### `main.js`: seçili test
- `selectTest(id)`: `quiz.setTest(id)` → `renderTestMeta()` (alt başlık, yönerge, telif) → test daha önce bitirildiyse `result.show(cevaplar, id, { revealed: true })` (kazı-kazan atlanır), bitirilmediyse quiz paneli.
- `onEdit`: testi "bitirilmemiş" yapar, son soruya döner. `onRestart`: bitirilmemiş yapar, cevapları siler.
- `onFinish(answers, id)`: `finished.set`, `trackTestCompleted(id)`, sonuç paneli.

### `testswitch.js`: `initTestSwitch({ container, ids, current, onSelect })`
`ids` = `Object.keys(TESTS)`. Her test için `.btn` (aktif) / `.btn .btn-ghost` (pasif) düğmesi, `aria-pressed`. Etiket `tests.<id>.name`. `ids.length < 2` ise `container.hidden = true`. Yeni CSS gerekmez. Döndürür: `{ set(id) }`.

### `quiz.js`: `createQuiz({...})`
Parametreler: `root, track, viewport, prevBtn, nextBtn, progressText, progressFill, progressBar, tipEl, tests, initialTest, onFinish`.
Döndürür: `{ setTest(id), goTo(n), reset(), lastIndex (getter), testId (getter), answersOf(id) }`.

- `setTest(id)`: `tests[id]`'ye göre soru ekranlarını yeniden kurar (`build`), o testin kayıtlı cevaplarını ve kalınan soruyu geri yükler. Bilinmeyen id hata fırlatır.
- Durum: `store` (id → `{ answers, index }`), `answers[]` (`null` veya `0..scaleSize-1`, aktif testinki), `index`, `autoAdvance`.
- Her soru bir `.slide`. `.track` `translateX(-index*100%)` ile kayar. Aktif olmayan slide'lara `inert` + `aria-hidden`.
- Seçenekler gizli `radio` + `label`. Etiket: `.opt-key` (1..n) + metin. Metinler `tests.<id>.questions.<i>` ve `tests.<id>.scale.<v>`.
- Seçenek numaraları `tests[id].keyBase`'den başlar (varsayılan 1; ESS 0: seçenekler 0–3, `0..3` tuşları). Başka bir testte olmayan numara (ör. SNS'te `0`) yok sayılır.
- İpucu satırı (`tipEl`): `t("test.tip", { min: keyBase, max: keyBase + scaleSize - 1 })`.
- Otomatik ilerleme: fare/dokunma ya da sayı tuşuyla seçilince 260 ms sonra bir sonraki soruya geçer (bu arada test değiştiyse geçmez). Klavyeyle (ok tuşları + boşluk) seçilince geçmez.
- Klavye (`root` üzerinde): `←` / `→` gezinme, `0..9` seçenek (`keyBase`'e göre; o testte olmayan sayı yok sayılır, zaten seçiliyse ilerler), `↑↓` otomatik ilerlemeyi kapatır.
- Kaydırma (dokunmatik): `|dx| > 50` ve `|dx| > 1.5·|dy|`. Fare ile kaydırma kapalı.
- `next()` cevap yoksa çalışmaz. Son soruda `onFinish(answers.slice(), id)` çağırır.
- `reset()` aktif testin cevaplarını ve seçimlerini temizler, 0. soruya döner.

### `result.js`: `createResult({...})`
Parametreler: `panel, content, canvas, hint, skipBtn, actions, summary, editBtn, restartBtn, onEdit, onRestart`.
Döndürür: `{ show(answers, testId, { revealed }), hide() }`.

`show(answers, testId, opts)`:
1. `TESTS[testId].scoring` ile `classify(computeScore(answers, scoring), scoring)` → mesaj anahtarı → `tests.<id>.messages.<anahtar>` → `#result-content`. `showScore` ise başlıkla gövde arasına `result.score` satırı (`.result-score`) eklenir.

3. panel açılır, `requestAnimationFrame` içinde `scratch.reset()`; `opts.revealed` ise hemen ardından `scratch.revealNow()`
4. Kapak açılınca (`onReveal`): `hint` ve `skipBtn`'ın parent'ı gizlenir, `actions` gösterilir


### `scratch.js`: `createScratch({ canvas, onReveal, getLabel, threshold=0.5, brush=36 })`
Döndürür: `{ reset(), revealNow(), relabel() }`.

- Kapak canvas'a çizilir. Renkleri `getComputedStyle(documentElement)` üzerinden `--scratch-a`, `--scratch-b`, `--scratch-ink` okur (çizim anında, bu yüzden tema değişince kapak kendiliğinden yenilenmez, bkz. `theme.js > onThemeChange`). Yazı `getLabel()` ile gelir.
- Silme: `destination-out`, pointer events, `setPointerCapture`. Silinen alan oranı 250 ms'de bir ve bırakınca örneklenir (her 16. piksel). Oran `threshold`'u geçince `reveal()`.
- `touched` bayrağı: silmeye başlanınca `relabel()` kapağı yeniden çizmez (silinmiş alan kaybolmasın).
- Pencere boyutu değişince (silinmemişse) kapak yeniden çizilir.

### `scoring.js`
- `maxScore(scoring, scaleSize)`: en yüksek skor (`Σ ağırlık × (scaleSize - 1)`), skor satırındaki "/ Y" için.
- `computeScore(answers, scoring)` ağırlıklı toplam. `scoring` her zaman açıkça verilir (varsayılanı yok). Cevap değeri = seçeneğin sırası (0'dan).
- `classify(score, scoring)` iki biçimi destekler:
  - `{ weights, threshold }`: `"suspect" | "unlikely"`, `threshold == null` ise her zaman `"neutral"`.
  - `{ weights, bands: [{ min, key }, ...] }` (artan `min` sırasında): skor `>= min` olan son bandın `key`'i, hiçbiri yoksa `"neutral"`.
- Durum: `TESTS.sns.scoring` içindeki `weights` ve `threshold` geçici değerler (hepsi 1 / `null`). Doğrulanmış değerlerle `config.js` içinde değiştirilecek. `TESTS.ess.scoring` kaynaktan doğrulanmıştır (ESS Scaling and Scoring v2.0, Mapi Research Trust, Ağustos 2017): ağırlık yok, toplam 0–24, bantlar 0–5 / 6–10 / 11–12 / 13–15 / 16–24.

---

## 6. Diğer modüller

- `share.js`: `https://wa.me/?text=` + `encodeURIComponent(t("share.text") + " " + url)`. `url` = mevcut adres, hash ve query'siz, `?lang=<aktif dil>` eklenmiş. Dil değişince yeniden kurulur.
- `site.js`: footer'ı `AUTHOR.name`, `AUTHOR.links[]` (`config.js`) ve `footer.role`, `footer.note` (dil dosyası) ile çizer. `statsEnabled` ise ikinci bir paragraf olarak `footer.statsNote` eklenir. `http(s)` ile başlayan linklere `target="_blank" rel="noopener"`.
- `langswitch.js`: `LANGUAGES`'tan bayrak butonları üretir (`<button><img></button>`, `aria-label` = dilin kendi adı, `aria-pressed` = aktif dil).

### `theme.js` (tema)
Dışa aktarır: `initTheme()`, `getTheme()`, `onThemeChange(fn)`.

- **Öncelik:** kullanıcının tema butonuyla yaptığı seçim (`localStorage["theme"]` = `"dark"` | `"light"`, başka değer yok sayılır) > tarayıcı/sistem ayarı (`prefers-color-scheme`).
- **Uygulama:** seçim varsa `<html data-theme="dark|light">`. Seçim yoksa özellik hiç konmaz, renkleri `base.css` içindeki media query belirler. Seçim yokken sistem teması değişirse (`matchMedia` `change`) sayfa canlı değişir, buton ve `onThemeChange` dinleyicileri güncellenir.
- **Buton (`#theme-btn`):** `aria-pressed` = şu an koyu mu. İkon `layout.css` ile `aria-pressed`'e göre seçilir (açıkken ay, koyuyken güneş: tıklayınca geçilecek tema). Tıklayınca ters tema seçilir, saklanır ve uygulanır. Etiket `theme.toggle` (`aria-label` `data-i18n-aria-label` ile, `title` JS ile ve dil değişince yenilenir).
- **Açılışta çakma:** `<head>`'deki satır içi script (bölüm 4) kayıtlı seçimi CSS'ten önce uygular. Seçim yoksa CSS tek başına doğru temayı verir.
- **`onThemeChange(fn)`:** şu an `main.js` tarafından dinlenmiyor. Dokunulmamış kazı-kazan kapağını yeni renklerle yeniden çizmek için hazır (`scratch.relabel()`).
- Veri gönderilmez.

### `stats.js` (sayaç)
Dışa aktarır: `statsEnabled`, `initStats()`, `trackTestCompleted(testId)`.
Ayar: `config.js > STATS = { workerUrl, goatcounterCode, paths: { view, testDone } }`. `paths.testDone` içindeki `{id}` test kimliğiyle değişir (varsayılan `/test-completed/{id}`).

İki bağımsız parça vardır:

| | Görevi | Ayar | Boşsa |
|---|---|---|---|
| **Worker** (`worker/`) | Home'daki sayıların kaynağı ve asıl sayım | `workerUrl` | sayı kutusu görünmez, Worker'a istek gitmez |
| **GoatCounter** | Arka planda ek sayım. Sayılar bundan **okunmaz** | `goatcounterCode` | hiçbir istek gitmez |

- `statsEnabled` = ikisinden biri doluysa `true`. `site.js` buna bakıp footer'a `footer.statsNote` ekler.
- **Sayılmayan ziyaretler** (`shouldTrack`, iki parça için de geçerli): `localhost` / `127.0.0.1` / `file://`, `navigator.doNotTrack === "1"`, `navigator.globalPrivacyControl`, `localStorage.skipgc` dolu olan tarayıcı (kendi ziyaretini saymamak için `localStorage.setItem("skipgc","t")`). Sayılmayan ziyaretçi sayıları yine de görür (sadece okuma).
- **Sayfa açılışı:** Sayılan ziyarette tek istek: `POST <workerUrl>/tally/view` (artırır ve güncel `{views, tests, byTest}` döndürür). Sayılmayan ziyarette `GET <workerUrl>/tally`. Ek olarak GoatCounter doluysa `new Image().src = https://<kod>.goatcounter.com/count?p=/&rnd=...`.
- **Test bitişi:** `trackTestCompleted(id)` her test için sayfa yüklemesi başına en fazla bir kez: `POST <workerUrl>/tally/test/<id>` (dönen sayılarla kutu güncellenir) ve GoatCounter'a `p=/test-completed/<id>`. Aynı testin cevaplarını düzenleyip yeniden bitirmek tekrar saymaz, farklı bir test ayrıca sayılır.
- **Home kutusu:** "tamamlanan test" tüm testlerin toplamıdır (`tests`). Test başına sayılar yanıtta `byTest` olarak gelir, şu an ekranda gösterilmiyor.
- **Gönderilen veri:** yalnızca "sayfa açıldı" / "şu test bitti" olayı. Cevap, skor, dil, tema, referrer, başlık gönderilmez. Worker'a giden istekte gövde ve özel başlık yoktur (CORS ön isteği gerekmez).
- **Hata** (ağ, 403, bozuk yanıt): konsola uyarı yazılır, kutu gizli kalır, sayfa çalışmaya devam eder. İki sayı da 0 ise kutu gösterilmez.
- Sayılar `Intl.NumberFormat(t("meta.dateLocale"))` ile yazılır, dil değişince yeniden yazılır.

### `worker/` (sayaç API'si)
Cloudflare Worker + D1. Site dosyalarından bağımsız yayınlanır (`worker/README.md`).

- `GET /tally` → `{ "views": n, "tests": n, "byTest": { "<id>": n } }` (`tests` = `byTest` toplamı)
- `POST /tally/view` ve `POST /tally/test/<id>` → ilgili sayaç +1, güncel sayıları döndürür. Artırma `INSERT ... ON CONFLICT DO UPDATE SET n = n + 1` ile tek `batch` içinde yapılır, eşzamanlı isteklerde sayı kaybolmaz.
- `<id>` yalnızca `worker/src/index.js > TEST_IDS` listesindeyse (şu an `sns`, `ess`) kabul edilir, değilse 404 (rastgele id ile tabloya satır eklenemez). Eski `POST /tally/test` rotası kaldırıldı (404).
- Veri: `counters(name TEXT PRIMARY KEY, n INTEGER)` tablosu, satırlar `views` ve her test için `test_<id>`. Satırlar ilk artırmada kendiliğinden oluşur. IP, kimlik, cevap saklanmaz.
- **Origin filtresi:** `POST` yalnızca `Origin` başlığı `wrangler.toml > ALLOWED_ORIGINS` listesindeyse kabul edilir, aksi halde 403. İzinli origin `Access-Control-Allow-Origin` ile geri yansıtılır, izinsiz origin yanıtı tarayıcıdan okuyamaz. Bu bir güvenlik önlemi değil, tesadüfi ve başka siteden gelen artırmaları engelleyen filtredir: `Origin` başlığını taklit eden biri sayıyı artırabilir. IP başına sınır yoktur.
- Rota adları (`/tally`) reklam engelleyici listelerinde sık geçen sözcüklerden bilerek kaçınır. Engellenme olursa kendi alan adına bağlı Worker rotası en sağlam çözümdür.
- Cloudflare ücretsiz plan limitleri: günde 100.000 Worker isteği, D1'de günde 100.000 satır yazma. Limit aşılırsa istekler hata verir, site bozulmaz (kutu gizlenir).

### `richtext.js` + `references.js` (alıntılar)
Dışa aktarır: `initRichText()`. Veri: `references.js > REFERENCES = { anahtar: { text, url? } }` (dilden bağımsız).

- **Kutu:** `[data-rich-block="id"]` (Hakkımda ve Narkolepsi'de `.scroll-box`). İçinde iki tür eleman: `[data-i18n-rich="anahtar"]` (dil dosyasında string) ve `[data-i18n-rich-list="anahtar"]` (dil dosyasında dizi, her eleman bir paragraf; `## ` ile başlayan h3 olur). Kaynak listesi `[data-refs]` alanına yazılır.
- **Söz dizimi:** metinde `[@anahtar]` → üst simge numara (`a.cite`, `href="#ref-<kutu>-<n>"`). Numara kutu içinde, DOM sırasıyla ilk geçişe göre verilir; aynı anahtar aynı numarayı korur. Numaralar kutuya özeldir (iki kutuda aynı kaynak farklı numara alabilir).
- **Kaynak listesi:** `<ol>`, sadece alıntılanan kaynaklar, alıntı sırasıyla. `url` varsa `target="_blank" rel="noopener noreferrer"` link, yoksa düz metin. Sadece `http(s)://` ile başlayan url link olur (`javascript:` vb. reddedilir). Hiç alıntı yoksa liste alanı gizli kalır.
- **Hata durumu:** `REFERENCES` içinde olmayan anahtar metinde olduğu gibi (`[@anahtar]`) kalır ve konsola uyarı yazar.
- **Tıklama:** numaraya tıklayınca adres değişmeden kutu içinde ilgili kaynağa kaydırılır, kaynak kısa süre vurgulanır (`.flash`). `prefers-reduced-motion` altında animasyonsuz.
- Dil değişince (`onLangChange`) tüm kutular yeniden çizilir. HTML içindeki İngilizce metin yalnızca JS yüklenmeden önceki yedektir.
- Metin DOM'a `textContent` / `append` ile eklenir, `innerHTML` kullanılmaz.
- Başlık şeridi: listedeki ## başlıklarından (2 ve üstü) kutunun başına yapışık .toc butonları kurulur. Etiket başlık metnidir, tek dil anahtarı narcolepsy.tocLabel. Tıklayınca kutu içinde başlığa kayar (adres değişmez).

---

## 7. CSS yapısı

### `base.css`
- Renk değişkenleri `:root`'ta (açık tema). Koyu tema iki yoldan gelir ve ikisinde de aynı değişkenler yeniden tanımlanır (elle senkron):
  1. `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }`: kullanıcı seçim yapmadıysa sistem ayarı, açık seçtiyse uygulanmaz.
  2. `:root[data-theme="dark"] { ... }`: kullanıcı koyu seçtiyse (sistem açık olsa da).
- `color-scheme` her iki temada `:root`'ta açıkça verilir (kaydırma çubuğu, form elemanları temaya uyar). `<meta name="color-scheme">` yedek olarak durur.
- Değişkenler: `--bg --surface --text --muted --accent --accent-strong --accent-soft --on-accent --border --warm --danger --scratch-a --scratch-b --scratch-ink --radius --maxw --header-h --font --font-serif`.
- `--header-h` varsayılan `3.5rem`. `layout.css` içinde `max-width: 36rem` altında `5.4rem`. `scroll-padding-top` bu değişkene bağlı.
- `[hidden] { display: none !important }` global.
- Yumuşak scroll yalnızca `prefers-reduced-motion: no-preference` iken.



### `layout.css`
- `.container`: `max-width: var(--maxw)`, yatay padding.
- `.site-header`: fixed, yarı saydam `color-mix` + `backdrop-filter`. İçi flex: `.brand` · `.site-nav` · `.header-tools` (`.lang-list` + `.theme-btn`).
- `.lang-list` / `.lang-btn`: yuvarlak bayrak, pasif `opacity .55`, aktif (`aria-pressed="true"`) tam opak + çerçeve.
- `.theme-btn`: bayrakla aynı boyutta (`1.9rem`) yuvarlak, ince çerçeveli buton. `.icon-moon` / `.icon-sun` iki SVG'si `aria-pressed`'e göre biri gösterilir (`aria-pressed="true"` = koyu → güneş).
- `.section .container { text-align: center }`: sayfa ortalaması buradan. `.row` `justify-content: center`.
- `.section.section-first` (Home): `padding-top: var(--header-h)`, alt padding yok. Seçici bilerek iki sınıflı: mobildeki `.section` padding'ini ezmek için.
- `.hero`: Home içeriği, `min-height: 100svh - header`, dikey ortalı flex. `.hero-title`, `.stats`, `.stat`, `.stat-num`, `.stat-label`.
- Breakpoint `36rem`: header grid olur (1. satır isim + `.header-tools`, 2. satır menü), `--header-h` büyür.
- Breakpoint `30rem`: font ve boşluk küçültme.
- Footer sınıfları: `.site-footer .author-name .author-role .author-links .footer-note`.

### `components.css`
- `.btn`, `.btn-ghost`
- İlerleme: `.progress`, `.progress-text`, `.progress-bar`
- Kayar test: `.viewport` (overflow hidden), `.track` (flex, transform geçişi), `.slide` (`flex: 1`, içinde 4px padding), `.question-text`, `.options`, `.option`, `.opt-key`. Seçili durum `input:checked + label`.
- `.scroll-box`: `max-height: min(62vh, 30rem)`, `overflow-y: auto`, solda hizalı (sayfanın geri kalanı ortalı). Kaydırma gölgesi `background-attachment: local` ile. Klavye için HTML'de `tabindex="0" role="region"` + isim (`aria-label` / `aria-labelledby`).
- Alıntılar: `.cite`, `.refs`, `.refs-title`, `.refs li.flash`.
- Sonuç: `.scratch-card`, `.scratch-content`, canvas üst katman, `.revealed` ile `opacity: 0`.
- `prefers-reduced-motion: reduce` altında geçişler kapalı.

## 8. Değişiklik rehberi

| Yapılacak | Değişecek yer |
|---|---|
| Yeni dil ekleme | `js/locales/<kod>.js` + `assets/flags/<kod>.svg` + `languages.js` içine bir satır. Her dilde `tests.<id>` blokları da çevrilir. Tarayıcı dili eşlemesi otomatik çalışır. |
| Tarayıcı dili eşleme mantığı | `i18n.js > fromBrowser`, öncelik sırası `initI18n` |
| Yazar açıklaması, footer notu | `locales/*.js > footer` |
| Soru metni düzenleme | `locales/*.js > tests.<id>.questions` |
| Soru ekleme/çıkarma | her `locales/*.js > tests.<id>.questions` + `config.js > TESTS[id].questionCount` + `scoring.weights` |
| Seçenek sayısını değiştirme | her `locales/*.js > tests.<id>.scale` + `TESTS[id].scaleSize` |
| Skor katsayıları, eşik, bantlar | `config.js > TESTS[id].scoring` |
| Sonuç mesajları | `locales/*.js > tests.<id>.messages` |
| Sonuç mantığı | `scoring.js` |
| Varsayılan (ilk açılan) test | `config.js > DEFAULT_TEST` |
| Testin yönergesi, telif satırı | `locales/*.js > tests.<id>.intro`, `tests.<id>.copyright` (lisanslı metinse düzenlenmez) |
| Sonuçta skor gösterme / gizleme | `config.js > TESTS[id].showScore` |
| Seçenek numarası 0'dan / 1'den başlasın | `config.js > TESTS[id].keyBase` |
| Yeni test ekleme | aşağıdaki "Yeni test ekleme" |
| Kazı-kazan davranışı | `scratch.js` (`threshold`, `brush`), renkler `base.css` (`--scratch-*`) |
| Renk, font, ölçü | `base.css` `:root` ve koyu tema (iki yerde: media query bloğu ve `:root[data-theme="dark"]`, elle senkron) |
| Tema butonu (ikon, yer) | `index.html > #theme-btn` + `layout.css > .theme-btn` |
| Tema butonu etiketi | `locales/*.js > theme.toggle` (+ `index.html` İngilizce yedeği) |
| Tema saklama anahtarı | `theme.js > STORAGE_KEY` ve `index.html > <head>` satır içi script (iki yerde) |
| Tema değişince bir şey yapma | `theme.js > onThemeChange(fn)` (ör. `main.js` içinden `scratch.relabel()`) |
| Arka plan | `background.css` + `index.html > #bg` |
| Yeni bölüm ekleme | `index.html` (section id) + `nav` linki + `locales > nav.*` anahtarı |
| Yeni yerelleştirilen HTML metni | elemana `data-i18n="anahtar"` + tüm dil dosyalarına anahtar |
| Menü/header düzeni | `layout.css` (`--header-h`, `.header-tools`, `36rem` breakpoint) |
| Sayı kutusunu açma / kapama | `config.js > STATS.workerUrl` (boş = kapalı) |
| GoatCounter arka plan sayımını açma / kapama | `config.js > STATS.goatcounterCode` (boş = kapalı) |
| GoatCounter'a giden yollar | `config.js > STATS.paths` |
| Worker'a izin verilen siteler | `worker/wrangler.toml > ALLOWED_ORIGINS` (sonra Worker'ı yeniden yayınla) |
| Yeni sayaç (test dışı) ekleme | `worker/src/index.js` (rota + `totals`), `stats.js`, sayfada gösterim |
| Sayacın gösterdiği etiketler | `locales/*.js > home.views`, `home.tests` |
| Kaynak ekleme | `references.js > REFERENCES`, metinde `[@anahtar]` |
| Narkolepsi metnine paragraf / başlık ekleme | her `locales/*.js > narcolepsy.body` dizisine eleman (başlık için `## ` ile başla) |
| Kutuda kaydırma yüksekliği, hizalama | `components.css > .scroll-box` |

### Yeni test ekleme

Test seçici, quiz, sonuç, PDF özeti ve sayaç test kimliğine (`id`) göre çalışır, bu yüzden yeni test için yeni modül yazılmaz. Adımlar (örnek id: `ess`):

1. **`js/config.js > TESTS`**: yeni anahtar ekle.
   ```js
   ess: {
     questionCount: 8,
     scaleSize: 4,
     scoring: {
       weights: [1, 1, 1, 1, 1, 1, 1, 1],
       bands: [ { min: 0, key: "..." }, { min: N, key: "..." } ],   // artan min, N değerleri kaynaktan doğrulanmalı
     },
   },
   ```
   Tek eşikli bir test ise `bands` yerine `threshold` kullan (mesaj anahtarları `suspect` / `unlikely`). İsteğe bağlı: `keyBase: 0` (numaralar 0'dan), `showScore: true` (sonuçta ve PDF'te skor). Çalışan bir bant örneği: `TESTS.ess`.
2. **Her `js/locales/*.js > tests.<id>`**: `name`, `subtitle`, `questions[]`, `scale[]`, `messages.<her band key>` (bant biçiminde `neutral` gerekmez, `threshold` biçiminde gerekir),  `intro[]` ve `copyright`. Soru ve seçenek sayıları 1. adımla aynı olmalı. Metinler telifli bir ölçekse lisans ve lisanslı çeviri gerekir, lisanslı metinler birebir kopyalanır (ESS örneği: `tests.ess`).
3. **`worker/src/index.js > TEST_IDS`**: id'yi ekle, Worker'ı yeniden yayınla (`wrangler deploy`). Eklenmezse test bitişi Worker'dan 404 alır (sayfa bozulmaz, konsola uyarı yazılır, o test Worker'da sayılmaz). D1 şemasında değişiklik gerekmez, satır ilk sayımda oluşur.
4. **Seçici otomatik görünür**: `TESTS` içinde 2 test olunca `#test-switch` açılır, buton etiketi `tests.<id>.name`.
5. **Metin güncellemeleri (isteğe bağlı, içerik)**: `about.p2` ve `home.tagline` yeni testi de anlatacak şekilde, `narcolepsy.body` içine yeni testi anlatan paragraf, `references.js`'e kaynaklar, `footer.note` gerekiyorsa.
6. **Kontrol**: `TESTS[id]` ile dil dosyalarındaki uzunluk ve anahtarlar tutarlı mı (bölüm 3, tutarlılık kuralları), her iki dilde testi bitir, test değiştirince cevapların ve sonucun korunduğunu gör.