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
  base.css          değişkenler (renk, font, ölçü), karanlık mod, reset, tipografi
  background.css    .bg arka plan katmanı
  layout.css        container, sabit header, nav, dil bayrakları, bölümler, footer, mobil header
  components.css    buton, ilerleme çubuğu, kayar sorular, seçenekler, kazı-kazan
  print.css         yazdırma / PDF çıktısı
js/
  main.js           giriş noktası, modülleri bağlar
  config.js         dilden bağımsız ayarlar (AUTHOR, QUIZ, SCORING, STATS)
  i18n.js           çeviri motoru
  languages.js      dil kaydı (LANGUAGES, DEFAULT_LANG)
  langswitch.js     header bayrak butonları
  site.js           footer render
  nav.js            scroll ile menü vurgusu
  share.js          WhatsApp linki
  stats.js          sayaç: görüntülenme / tamamlanan test (GoatCounter)
  quiz.js           adım adım test
  result.js         sonuç paneli, PDF özeti
  scratch.js        kazı-kazan canvas
  scoring.js        skor hesabı (DOM'suz)
  locales/
    en.js           varsayılan dil, tüm metinler
    tr.js
```

CSS yükleme sırası (`index.html`): `base` → `background` → `layout` → `components` → `print`.

---

## 2. Modül bağımlılıkları

```
main.js
 ├─ config.js            (QUIZ)
 ├─ i18n.js ──────────── languages.js ──(dynamic import)── locales/*.js
 ├─ langswitch.js ────── languages.js, i18n.js
 ├─ site.js ──────────── config.js (AUTHOR), i18n.js, stats.js (sadece statsEnabled)
 ├─ nav.js               (bağımsız)
 ├─ share.js ─────────── i18n.js
 ├─ stats.js ─────────── config.js (STATS), i18n.js
 ├─ quiz.js ──────────── i18n.js
 └─ result.js ────────── scoring.js ── config.js (SCORING)
                          i18n.js
                          scratch.js   (bağımsız)
```

Başlatma sırası (`main.js`):

1. `await initI18n()`
2. `initLangSwitch()`, `initSite()`, `initNav()`, `initShare()`
3. `initStats()` (beklenmez, sayılar gelince kutu kendi açılır)
4. `createResult({...})`
5. `createQuiz({...})`; `onFinish` içinde `trackTestCompleted()` çağrılır, sonra `result.show()`

`createResult` içindeki `onEdit` / `onRestart` callback'leri `quiz` değişkenine, `createQuiz` içindeki `onFinish` ise `result` değişkenine referans verir. İkisi de çağrıldıkları anda tanımlıdır.

---

## 3. i18n

### Dosyalar
- `languages.js`: `DEFAULT_LANG`, `LANGUAGES = [{ code, name, flag, load }]`. `load` dinamik `import()` döndürür.
- `locales/<kod>.js`: `export default { ... }` tek obje.
- `i18n.js` dışa aktarır: `initI18n`, `setLang(code, {persist})`, `t(path, vars)`, `get(path)`, `getLang()`, `onLangChange(fn)`.

### Dil seçim önceliği (`initI18n`)
1. URL `?lang=`
2. `localStorage["lang"]` (try/catch içinde)
3. `DEFAULT_LANG`

### Çalışma şekli
- Seçili dil sözlüğü `dict`, varsayılan dil `fallback`. `get(path)` önce `dict`'e, bulamazsa `fallback`'e bakar. Eksik çeviri varsayılana düşer.
- `t(path, vars)` string döndürür, `{n}` biçimindeki yer tutucuları `vars` ile doldurur. Anahtar yoksa path'i döndürür.
- Path noktalı: `messages.suspect.title`, `questions.0`.
- `setLang` içinde `seq` sayacı var: arka arkaya iki dil seçilirse sadece sonuncusu uygulanır. Yükleme hatasında konsola yazar, mevcut dil kalır.
- Dil uygulanınca sırayla: `<html lang>`, `document.title`, meta description, `[data-i18n]` ve `[data-i18n-aria-label]` elemanları, sonra `onLangChange` dinleyicileri.

### Dil değişince tetiklenen dinleyiciler (kayıt sırasıyla)
| Modül | Fonksiyon | Yaptığı |
|---|---|---|
| `langswitch.js` | `mark` | `aria-pressed` günceller |
| `site.js` | `renderFooter` | footer'ı yeniden çizer |
| `share.js` | `update` | link `href`'ini yeniden kurar |
| `stats.js` | `render` | sayıları yeni dilin biçimiyle yazar (yalnızca sayaç açıksa kayıtlı) |
| `result.js` | `render` | mesaj + PDF özeti + kapak yazısı |
| `quiz.js` | `refreshText` | soru ve seçenek metinleri, ilerleme, buton etiketi |

### Dil dosyası anahtar ağacı
```
meta         title, description, dateLocale
site         name
nav          aria, home, about, narcolepsy, test
lang         label
home         tagline, start, views, tests
about        lead, big, p1, p2
narcolepsy   title, soon
test         title, subtitle, progress({n},{total}), prev, next, finish, tip
questions[]  soru metinleri
scale[]      seçenek etiketleri
result       cover, hint, skip, pdf, pdfTip, edit, restart
share        button, text
messages     suspect | unlikely | neutral  →  { title, body }
print        title, note
footer       role, note, statsNote   (statsNote yalnızca sayaç açıkken gösterilir)
```

HTML'e `data-i18n` ile bağlananlar: `site.name`, `nav.*`, `home.*`, `about.*`, `narcolepsy.*`, `test.title`, `test.subtitle`, `test.prev`, `test.tip`, `result.hint`, `result.skip`, `result.pdf`, `result.pdfTip`, `result.edit`, `result.restart`, `share.button`.

JS ile çizilenler: `questions`, `scale`, `test.progress`, `test.next`, `test.finish`, `messages.*`, `print.*`, `meta.dateLocale`, `footer.*`, `share.text`, `result.cover`.

### Tutarlılık kuralları
- `config.js > QUIZ.questionCount` = `questions.length`, `QUIZ.scaleSize` = `scale.length` (her dil dosyasında).
- `SCORING.weights.length` = `questionCount`.
- `index.html` içindeki `data-i18n` elemanlarında İngilizce yedek metin de durur (JS yüklenmeden / JS kapalıyken görünür). İngilizce metin değişirse hem `locales/en.js` hem `index.html` güncellenir.

---

## 4. HTML kancaları (`index.html`)

JS'in bağlandığı id ve attribute'lar:

| Seçici | Kullanan |
|---|---|
| `#lang-list` | `langswitch.js` (bayraklar buraya basılır) |
| `#footer` | `site.js` |
| `.site-nav a[href="#..."]`, `#about`, `#narcolepsy`, `#test` | `nav.js` |
| `[data-share-whatsapp]` | `share.js` |
| `#stats`, `#stat-views`, `#stat-tests` | `stats.js` (`#stats` varsayılan `hidden`) |
| `#test-title` | `main.js` (`scrollToTest`) |
| `#quiz-panel`, `#quiz-viewport`, `#quiz-track`, `#prev-btn`, `#next-btn` | `quiz.js` |
| `#progress-text`, `#progress-fill`, `#progress-bar` | `quiz.js` |
| `#result-panel`, `#result-content`, `#scratch`, `#scratch-hint`, `#skip-scratch`, `#result-actions` | `result.js` |
| `#edit-btn`, `#restart-btn`, `#print-btn`, `#print-summary` | `result.js` |
| `#bg` | arka plan katmanı (JS bağlı değil) |

Bölüm id'leri: `home`, `about`, `narcolepsy`, `test`. Menü linkleri bunlara `href` ile gider. `.brand` linki `#home`'a gider. Sayfadaki tek `<h1>` Home bölümündeki başlıktır, diğer bölüm başlıkları `<h2>`.

---

## 5. Test akışı

### `quiz.js`: `createQuiz({...})`
Parametreler: `root, track, viewport, prevBtn, nextBtn, progressText, progressFill, progressBar, count, scaleSize, onFinish`.
Döndürür: `{ goTo(n), reset(), lastIndex }`.

- Durum: `answers[]` (`null` veya `0..scaleSize-1`), `index`, `autoAdvance`.
- Her soru bir `.slide`. `.track` `translateX(-index*100%)` ile kayar. Aktif olmayan slide'lara `inert` + `aria-hidden`.
- Seçenekler gizli `radio` + `label`. Etiket: `.opt-key` (1..n) + metin.
- Otomatik ilerleme: fare/dokunma ya da sayı tuşuyla seçilince 260 ms sonra bir sonraki soruya geçer. Klavyeyle (ok tuşları + boşluk) seçilince geçmez.
- Klavye (`root` üzerinde): `←` / `→` gezinme, `1..9` seçenek (zaten seçiliyse ilerler), `↑↓` otomatik ilerlemeyi kapatır.
- Kaydırma (dokunmatik): `|dx| > 50` ve `|dx| > 1.5·|dy|`. Fare ile kaydırma kapalı.
- `next()` cevap yoksa çalışmaz. Son soruda `onFinish(answers.slice())` çağırır.
- `reset()` cevapları ve seçimleri temizler, 0. soruya döner.

### `result.js`: `createResult({...})`
Parametreler: `panel, content, canvas, hint, skipBtn, actions, summary, editBtn, restartBtn, printBtn, onEdit, onRestart`.
Döndürür: `{ show(answers), hide() }`.

`show(answers)`:
1. `classify(computeScore(answers))` → mesaj türü → `#result-content`
2. `#print-summary` doldurulur (soru + seçilen etiket, tarih `meta.dateLocale` ile)
3. panel açılır, `requestAnimationFrame` içinde `scratch.reset()`
4. Kapak açılınca (`onReveal`): `hint` ve `skipBtn`'ın parent'ı gizlenir, `actions` gösterilir

`#print-btn` → `window.print()`.

### `scratch.js`: `createScratch({ canvas, onReveal, getLabel, threshold=0.5, brush=36 })`
Döndürür: `{ reset(), revealNow(), relabel() }`.

- Kapak canvas'a çizilir. Renkleri `getComputedStyle(documentElement)` üzerinden `--scratch-a`, `--scratch-b`, `--scratch-ink` okur. Yazı `getLabel()` ile gelir.
- Silme: `destination-out`, pointer events, `setPointerCapture`. Silinen alan oranı 250 ms'de bir ve bırakınca örneklenir (her 16. piksel). Oran `threshold`'u geçince `reveal()`.
- `touched` bayrağı: silmeye başlanınca `relabel()` kapağı yeniden çizmez (silinmiş alan kaybolmasın).
- Pencere boyutu değişince (silinmemişse) kapak yeniden çizilir.

### `scoring.js`
- `computeScore(answers, scoring=SCORING)` ağırlıklı toplam.
- `classify(score, scoring=SCORING)` → `"suspect" | "unlikely" | "neutral"`. `threshold == null` ise her zaman `"neutral"`.
- Durum: `SCORING.weights` ve `threshold` geçici değerler (hepsi 1 / `null`). Doğrulanmış değerlerle `config.js` içinde değiştirilecek.

---

## 6. Diğer modüller

- `nav.js`: `IntersectionObserver`, `rootMargin: "-35% 0px -60% 0px"`. Kesişen bölümün menü linkine `aria-current="true"` koyar.
- `share.js`: `https://wa.me/?text=` + `encodeURIComponent(t("share.text") + " " + url)`. `url` = mevcut adres, hash ve query'siz, `?lang=<aktif dil>` eklenmiş. Dil değişince yeniden kurulur.
- `site.js`: footer'ı `AUTHOR.name`, `AUTHOR.links[]` (`config.js`) ve `footer.role`, `footer.note` (dil dosyası) ile çizer. `statsEnabled` ise ikinci bir paragraf olarak `footer.statsNote` eklenir. `http(s)` ile başlayan linklere `target="_blank" rel="noopener"`.
- `langswitch.js`: `LANGUAGES`'tan bayrak butonları üretir (`<button><img></button>`, `aria-label` = dilin kendi adı, `aria-pressed` = aktif dil).

### `stats.js` (sayaç)
Dışa aktarır: `statsEnabled`, `initStats()`, `trackTestCompleted()`. Ayar: `config.js > STATS = { goatcounterCode, paths: { view, testDone } }`.

- `goatcounterCode` boşsa (`statsEnabled === false`) hiçbir istek atılmaz, `#stats` gizli kalır, footer'a `statsNote` eklenmez.
- **Sayma (yazma):** `new Image().src = https://<kod>.goatcounter.com/count?p=<yol>&rnd=<rastgele>`. Yalnızca iki yol gönderilir: `/` (sayfa açılışı) ve `/test-completed` (test bitti). Cevap, skor, dil, referrer, başlık gönderilmez. Üçüncü taraf script yok.
- Test tamamlanması GoatCounter'da sanal sayfa görüntülemesi olarak tutulur (olay sayacı belgelenmediği için). Sayfa yüklemesi başına en fazla bir kez gönderilir.
- **Sayılmayan ziyaretler** (`shouldTrack`): `localhost` / `127.0.0.1` / `file://`, `navigator.doNotTrack === "1"`, `navigator.globalPrivacyControl`, `localStorage.skipgc` dolu olan tarayıcı (kendi ziyaretini saymamak için `localStorage.setItem("skipgc","t")`).
- **Okuma:** `GET https://<kod>.goatcounter.com/counter/<encodeURIComponent(yol)>.json`. Yanıtta `count` binlik ayraçlı string, rakam dışı karakterler atılıp sayıya çevrilir. 404 = 0. Okuma, sayma kuralından bağımsızdır (localhost'ta da okur).
- Hata (403, ağ, bozuk yanıt) ya da iki sayı da 0 ise kutu gösterilmez, sayfa çalışmaya devam eder.
- Sayılar `Intl.NumberFormat(t("meta.dateLocale"))` ile yazılır, dil değişince yeniden yazılır.
- GoatCounter tarafı: site ayarlarında "Allow adding visitor counts on your website" açık olmalı (varsayılan kapalı). Sayaç yanıtları en fazla 4 saat önbelleklenir, sayılar gecikmeli güncellenir.

---

## 7. CSS yapısı

### `base.css`
- Renk değişkenleri `:root`'ta, koyu mod `@media (prefers-color-scheme: dark)` ile aynı değişkenleri yeniden tanımlar. Tema anahtarı yok.
- Değişkenler: `--bg --surface --text --muted --accent --accent-strong --accent-soft --on-accent --border --warm --danger --scratch-a --scratch-b --scratch-ink --radius --maxw --header-h --font --font-serif`.
- `--header-h` varsayılan `3.5rem`. `layout.css` içinde `max-width: 36rem` altında `5.4rem`. `scroll-padding-top` bu değişkene bağlı.
- `[hidden] { display: none !important }` global.
- Yumuşak scroll yalnızca `prefers-reduced-motion: no-preference` iken.

### `background.css`
`.bg`: `position: fixed; inset: 0; z-index: -1; background: var(--bg)`. Arka plan değişikliği (gradient/canvas/shader) sadece bu katmanda yapılır, sayfanın geri kalanı etkilenmez.

### `layout.css`
- `.container`: `max-width: var(--maxw)`, yatay padding.
- `.site-header`: fixed, yarı saydam `color-mix` + `backdrop-filter`. İçi flex: `.brand` · `.site-nav` · `.lang-list`.
- `.lang-list` / `.lang-btn`: yuvarlak bayrak, pasif `opacity .55`, aktif (`aria-pressed="true"`) tam opak + çerçeve.
- `.section .container { text-align: center }`: sayfa ortalaması buradan. `.row` `justify-content: center`.
- `.section.section-first` (Home): `padding-top: var(--header-h)`, alt padding yok. Seçici bilerek iki sınıflı: mobildeki `.section` padding'ini ezmek için.
- `.hero`: Home içeriği, `min-height: 100svh - header`, dikey ortalı flex. `.hero-title`, `.stats`, `.stat`, `.stat-num`, `.stat-label`.
- Breakpoint `36rem`: header grid olur (1. satır isim + bayraklar, 2. satır menü), `--header-h` büyür.
- Breakpoint `30rem`: font ve boşluk küçültme.
- Footer sınıfları: `.site-footer .author-name .author-role .author-links .footer-note`.

### `components.css`
- `.btn`, `.btn-ghost`
- İlerleme: `.progress`, `.progress-text`, `.progress-bar`
- Kayar test: `.viewport` (overflow hidden), `.track` (flex, transform geçişi), `.slide` (`flex: 0 0 100%`, içinde 4px padding), `.question-text`, `.options`, `.option`, `.opt-key`. Seçili durum `input:checked + label`.
- Sonuç: `.scratch-card`, `.scratch-content`, canvas üst katman, `.revealed` ile `opacity: 0`.
- `prefers-reduced-motion: reduce` altında geçişler kapalı.

### `print.css`
`@media print` içinde `.bg`, header, footer, `#home`, `#about`, `#narcolepsy`, `#test`'in `#result-panel` dışındaki çocukları ve `#result-panel`'in `.print-summary` dışındaki çocukları gizlenir. Sadece `.print-summary` basılır (sola hizalı, beyaz zemin).

---

## 8. Değişiklik rehberi

| Yapılacak | Değişecek yer |
|---|---|
| Metin düzenleme | `js/locales/<dil>.js` (İngilizce `data-i18n` metinleri için ayrıca `index.html` yedeği) |
| Yeni dil ekleme | `js/locales/<kod>.js` + `assets/flags/<kod>.svg` + `languages.js` içine bir satır |
| Varsayılan dili değiştirme | `languages.js > DEFAULT_LANG` (yedek HTML metni de o dile uyarlanmalı) |
| Yazar adı, linkler | `config.js > AUTHOR` |
| Yazar açıklaması, footer notu | `locales/*.js > footer` |
| Soru ekleme/çıkarma | her `locales/*.js > questions` + `config.js > QUIZ.questionCount` + `SCORING.weights` |
| Seçenek sayısını değiştirme | her `locales/*.js > scale` + `QUIZ.scaleSize` |
| Skor katsayıları, eşik | `config.js > SCORING` |
| Sonuç mantığı | `scoring.js` |
| Kazı-kazan davranışı | `scratch.js` (`threshold`, `brush`), renkler `base.css` (`--scratch-*`) |
| Renk, font, ölçü | `base.css` `:root` (ve koyu mod bloğu) |
| Arka plan | `background.css` + `index.html > #bg` |
| Yeni bölüm ekleme | `index.html` (section id) + `nav` linki + `locales > nav.*` anahtarı |
| Yeni yerelleştirilen HTML metni | elemana `data-i18n="anahtar"` + tüm dil dosyalarına anahtar |
| Menü/header düzeni | `layout.css` (`--header-h`, `36rem` breakpoint) |
| PDF çıktısı | `print.css` + `result.js > renderSummary` (yeni bölüm eklenirse `print.css` gizleme listesine de ekle) |
| Sayacı açma / kapama | `config.js > STATS.goatcounterCode` (boş = kapalı) |
| Sayılan yollar | `config.js > STATS.paths` |
| Home içeriği | `index.html > #home` + `locales/*.js > home` |
| Sayacın gösterdiği etiketler | `locales/*.js > home.views`, `home.tests` |
