# Yapılacaklar

Öncelik: **P0** yayından önce şart · **P1** yayından hemen sonra / mümkünse önce · **P2** sonra.
Dosya yolları ve anahtar adları `ARCHITECTURE.md` ile uyumlu.

---

## 1. Düzenlenmesi gereken metinler

Metinler `js/locales/en.js` ve `js/locales/tr.js` içinde. Test metinleri `tests.<id>` altında (`tests.sns`, `tests.ess`). ESS'in yönerge, madde, seçenek ve telif metinleri lisanslıdır, düzenlenmez (`ARCHITECTURE.md` bölüm 3). 

### P0

- [ ] **Footer notu** (`footer.note`): Hukuki/tıbbi sorumluluk reddi son kez gözden geçirilmeli. "Cevapların hiçbir yere kaydedilmez" cümlesi, cevapları gönderen bir özellik eklenirse yanlış olur. Not: cihazda dil ve tema tercihi saklanıyor (yalnızca kullanıcı bayrağa / tema butonuna tıklayınca), cümle cevapları kastediyorsa doğru, tercihleri de kapsayacak mı karar ver.
- [ ] **Sayaç notu** (`footer.statsNote`): Yalnızca sayaç açıkken görünür. Gerçekte ne sayıldığını doğru anlatıyor mu, son kez oku (ziyaret ve tamamlanan test sayısı, anonim). Not: artık hangi testin bittiği de sayılıyor (test başına sayaç), metin bunu kapsıyor mu bak.


- [ ] **Site adı** (`site.name`, `meta.title`): Geçici isim. Karar verilince iki dilde de güncelle.

### P1

- [ ] **İngilizce metinler** (hepsi): Ben çevirdim. Ana dili İngilizce olan biri okumalı, özellikle `about.*`.
- [ ] **Meta açıklaması** (`meta.description`): Sosyal medya / arama önizlemesinde görünecek, son hali yazılmalı.

- [ ] **Test alt başlıkları** (`tests.sns.subtitle`, `tests.ess.subtitle`): "yaklaşık 2 dakika" gerçek kullanıcı süresiyle doğrula (ESS 8 soru).
- [ ] **Hata / boş durumlar**: JS kapalı mesajı yalnızca İngilizce (`index.html > noscript`).
- [ ] **Yerelleştirme gözden geçirme**: Türkçe metinler son kez, İngilizce metinler ana dilli biri tarafından.

---

## 2. Eklenecek özellikler

### P0 (yayından önce)

- [ ] **Skorlama**: `config.js > TESTS.sns.scoring` içine makaledeki katsayıları ve eşiği ekle, kaynağı koda yorum olarak yaz. Sonra `scoring.js` için birim testi (sınır değerleri: eşiğin tam üstü, tam altı, tüm 0, tüm maksimum, ayrıca `bands` biçimi: bant sınırları ve en düşük bandın altı). Eşik gelince SNS sonuç mesajlarını (`tests.sns.messages.suspect`, `unlikely`) yeniden oku (özellikle `unlikely` "sorun yok" izlenimi vermemeli) ve geçici `neutral` mesajını kaldır ya da hata durumuna çevir (`threshold` doluyken kullanılmaz).

- [ ] **Favicon** ve `theme-color` (açık ve koyu tema için `media` özellikli iki etiket ya da `theme.js`'ten güncelleme).
- [ ] **Sayaç Worker'ını yayınla** (kod hazır ve yerelde test edildi, `worker/README.md`): D1 oluştur, `wrangler.toml > database_id` ve `ALLOWED_ORIGINS` (yayın adresin) doldur, `wrangler deploy`, çıkan adresi `config.js > STATS.workerUrl`'a yaz. Yayında doğrula: Home'da sayılar geliyor, test bitirince "tamamlanan test" artıyor. Kendi tarayıcında `localStorage.setItem("skipgc","t")` çalıştır. Test sayacı rotası artık `POST /tally/test/<id>`, `worker/src/index.js > TEST_IDS` (`sns`, `ess`) `config.js > TESTS` ile aynı olmalı. ESS eklendiği için Worker'ı yeniden yayınlamadan ESS sayımı Worker'da 404 alır (sayfa bozulmaz). Yayından sonra her iki testi bitirip Home'daki toplamın ve GoatCounter'daki `/test-completed/sns` ve `/test-completed/ess` yollarının arttığını doğrula.
- [ ] **Worker dokümanları**: `worker/README.md` ve `worker/schema.sql` içinde eski `POST /tally/test` rotası ya da "iki satır (`views`, `tests`)" anlatımı varsa güncelle (test başına `test_<id>` satırı, satırlar ilk artırmada oluşur). Bu dosyalar çoklu test değişikliği sırasında elde değildi, kontrol edilmedi.
- [ ] **Reklam engelleyici testi**: Worker yayında uBlock Origin / AdGuard / Brave kalkanı açıkken sayfayı aç, `workers.dev` isteği engelleniyor mu bak. Engelleniyorsa sayılar düşük kalır, çözüm: Worker'ı kendi alan adına bağlamak (`stats` benzeri alt alan adı yerine nötr bir ad).

- [ ] **QR kartı**: Dağıtımda kullanılacak QR kodu ve basılacak kartın tasarımı (QR'ı link kesinleşince üret, kısa ve `?lang=tr` içeren sürümünü kullan).
- [ ] **Gerçek cihaz testi**: iOS Safari ve Android Chrome. Kazı-kazan dokunma, kaydırma, `window.print()`, header iki satır düzeni (artık bayraklar + tema butonu), tarayıcı/sistem dili ve temasının otomatik gelmesi.

### P1

- [ ] **Tema kontrolü**: Tema butonu ve iki tema bütün bileşenlerde baştan sona gözle bak (açık/koyu, sistem koyuyken açık seçme ve tersi). Özellikle:, sonuç ekranında dokunulmamış kazı-kazan kapağı tema değişince eski renkte kalıyor (aşağıda bilinen sorunlar), mobilde header'da bayraklar + buton sığıyor mu.

- [ ] **Test başına sayıları gösterme (isteğe bağlı)**: Worker `byTest` döndürüyor, ekranda yalnızca toplam var. İstenirse Home'da ya da test kartında test başına sayı.

- [ ] **Erişilebilirlik geçişi**: ekran okuyucu ile test akışı (radiogroup, ilerleme duyurusu), kontrast kontrolü (`--muted` açık ve koyu temada), odak sırası, `prefers-reduced-motion` altında kazı-kazan. Test değiştirince soru ekranları yeniden kurulduğu için odak ve duyuru davranışı da kontrol edilmeli. Tema butonu (`aria-pressed` + etiket) ekran okuyucuyla doğrulanmalı.
- [ ] **Kazı-kazan klavye ve ekran okuyucu yolu**: "Silmeden göster" butonu var, sonuç metni canvas'ın altında okunabilir. Yine de ekran okuyucuyla doğrula.
- [ ] **Arka plan shader'ı**: `background.css` ve `#bg` katmanına takılacak. Gerekenler: `prefers-reduced-motion` altında statik yedek, sekme gizliyken durdurma, mobilde performans sınırı, WebGL yoksa düz renk, iki temaya uyum.


### P2

- [ ] **Üçüncü dil**: Yeni dil kuralı `ARCHITECTURE.md` bölüm 8'de. RTL bir dil (ör. Arapça) eklenecekse `dir` attribute'u ve CSS mantıksal özellikleri gerekir.
- [ ] **Temada "sistemi izle" seçeneği**: Şu an butonla bir kez seçim yapılınca tercih kalıcı, sistem temasına geri dönmenin yolu yok (yalnızca `localStorage["theme"]`'i silmek). Üçüncü durum (sistem / açık / koyu) ya da uzun basma gibi bir yol eklenebilir.
- [ ] **Test ilerlemesini saklama**: Sayfa yenilenince cevaplar kaybolur (tüm testler için). `sessionStorage` ile saklamak mümkün ama gizlilik cümlesiyle çelişmemeli (cihazdan çıkmıyor, sekme kapanınca siliniyor).
- [ ] **Çevrimdışı kullanım**: Service worker ile. Sayfa tamamen statik olduğu için kolay.
- [ ] **GoatCounter'ın geleceği**: Şu an yalnızca arka planda sayım yapıyor, sayılar Worker'dan geliyor. Panel verisi (referrer, cihaz) istenirse GoatCounter'ın kendi `count.js` scriptine geçmek gerekir (şu an üçüncü taraf script yok, referrer gönderilmiyor), bu `footer.statsNote`'u etkiler. İstenmezse `goatcounterCode`'u boşaltmak yeter.
- [ ] **Worker'da kötüye kullanım sınırı**: IP başına sınır yok, `Origin` başlığını taklit eden biri sayıyı artırabilir. Sorun olursa Cloudflare'ın ücretsiz hız sınırlama kuralı ya da Worker içinde basit bir sınır eklenebilir.
- [ ] **İstatistik kutusu eşiği**: Sayılar çok düşükken (ilk günler, reklam engelleyici etkisi) kutu kötü görünebilir. `stats.js > render`'a "en az N görüntülenme olunca göster" eşiği eklenebilir. Şu an yalnızca ikisi de 0 ise gizleniyor.
- [ ] **Otomatik test**: Bu oturumdaki Playwright senaryosunu (dil değişimi, test akışı, sonuç, `?lang=`, test değiştirme) repo içine al, CI'da çalıştır. Çoklu test için senaryo: iki test arasında geçiş, cevapların korunması, bitirilmiş testin sonucunun geri gelmesi, düzenle / baştan başla. Tema ve dil için: tarayıcı dili (`locale`) ve `colorScheme` emülasyonuyla varsayılanın doğru gelmesi, butonla seçimin kalıcı olması, `?lang=` ve kayıtlı seçimin tarayıcı dilini ezmesi.


---

## 3. Bilinen sorunlar ve teknik borç


- [ ] **Kazı-kazan kapağı tema değişince yenilenmiyor** (`scratch.js`): Kapak renkleri çizim anında okunuyor. Sonuç ekranındayken (kapağa hiç dokunulmamışken) tema değişirse eski renkte kalır. `theme.js > onThemeChange` hazır, `main.js` içinden `scratch.relabel()`'a bağlanabilir (dokunulmuş kapakta `relabel()` zaten çizmez).

- [ ] **Koyu tema değişkenleri iki yerde** (`base.css`): Media query bloğu ve `:root[data-theme="dark"]` aynı değerleri tekrar eder, elle senkron. Renk değişince ikisini birlikte güncelle.
- [ ] **Sayı tuşları** (`1..n`) yalnızca test paneli odaktayken çalışıyor (`keydown` `#quiz-panel` üzerinde). Sayfada başka yerdeyken çalışmaz, bilerek böyle.

- [ ] **`localStorage` anahtarları** `"lang"` ve `"theme"` çok genel, alan adı paylaşılan bir ortamda çakışabilir. Önek eklemeyi düşün (tema anahtarı `index.html` içindeki satır içi scriptte de geçtiği için ikisini birlikte değiştir).
- [ ] **Test kimliği iki yerde**: `config.js > TESTS` ve `worker/src/index.js > TEST_IDS` elle senkron tutuluyor. Eşleşmezse o testin sayımı Worker'da 404 alır (sayfa bozulmaz).
- [ ] **Dokümantasyon**: Yapı değiştikçe `ARCHITECTURE.md` güncel tutulmalı.

---

## 4. Yayın öncesi kontrol listesi

- [ ] Skor katsayıları ve eşik makaleyle doğrulandı, birim testi yazıldı
- [ ] Yer tutucu hiçbir metin kalmadı (`config.js`, `footer.role`, `home.tagline`, `tests.*.messages.neutral`)
- [ ] `config.js > TESTS` ile `worker/src/index.js > TEST_IDS` aynı ve Worker yeniden yayınlandı
- [ ] Her iki dilde baştan sona manuel geçiş yapıldı
- [ ] Tarayıcı dili ve sistem teması değişince varsayılanlar doğru geliyor, butonla yapılan seçim kalıcı
- [ ] Gerçek telefonda test (iOS + Android), açık ve koyu tema
- [ ] Paylaşım önizlemesi WhatsApp'ta kontrol edildi

- [ ] Alan adı ve HTTPS çalışıyor