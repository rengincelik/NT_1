# Yapılacaklar

Öncelik: **P0** yayından önce şart · **P1** yayından hemen sonra / mümkünse önce · **P2** sonra.
Dosya yolları ve anahtar adları `ARCHITECTURE.md` ile uyumlu.

---

## 1. Düzenlenmesi gereken metinler

Metinler `js/locales/en.js` ve `js/locales/tr.js` içinde. `data-i18n` ile bağlı İngilizce metinlerin yedeği `index.html` içinde de duruyor, ikisi birlikte güncellenmeli.

### P0

- [ ] **Soru metinleri** (`questions`): Orijinal SNS makalesindeki (Sturzenegger ve ark., 2013) ifadelerle karşılaştır. Şu an Türkçesi birebir çeviri değil, İngilizcesi Türkçeden türetilmiş. Sorular resmî bir çevirisi varsa ona çekilmeli.
- [ ] **Cevap etiketleri** (`scale`): Orijinal ölçeğin cevap formatıyla karşılaştır. Şu an 5 kademeli frekans etiketi kullanılıyor, orijinal ölçek farklı olabilir.
- [ ] **Sonuç mesajları** (`messages.suspect`, `messages.unlikely`): Eşik netleşince yeniden yaz. Özellikle `unlikely` mesajı "sorun yok" izlenimi vermemeli.
- [ ] **Sonuç mesajı** (`messages.neutral`): Geçici metin. Eşik eklenince bu durum kullanılmayacak, kaldırılacak ya da bir hata durumuna çevrilecek.
- [ ] **Hakkında metni** (`about.p1`): "Türkiye'de binlerce insan" iddiası kaynaklı değil. Kaynak bulup rakamı düzelt ya da ifadeyi yumuşat. Aynı iddia İngilizce sürümünde de var.
- [ ] **Hakkında metni** (`about.p2`): "Klinikte kullanılan" ifadesi doğrulanmalı (ölçeğin hangi amaçla kullanıldığı, ön tarama mı, tanı destek mi).
- [ ] **Narkolepsi bölümü** (`narcolepsy.body`): Şu an geçici metin. İçerik yazılacak, tıbbi bilgiler doğrulanmış kaynaklardan alınacak, alıntılar `[@anahtar]` ile eklenecek.
- [ ] **Geçici kaynaklar** (`js/references.js`: `placeholder-1`, `placeholder-2`): Gerçek künye ve linklerle değiştir, kullanılmayanları sil.
- [ ] **Hakkımda metinlerinde alıntı** (`about.p1`, `about.p2`, ...): Yukarıdaki iddialar için kaynak eklenince `[@anahtar]` ile bağla.
- [ ] **Footer notu** (`footer.note`): Hukuki/tıbbi sorumluluk reddi son kez gözden geçirilmeli. "Cevapların hiçbir yere kaydedilmez" cümlesi, cevapları gönderen bir özellik eklenirse yanlış olur.
- [ ] **Sayaç notu** (`footer.statsNote`): Yalnızca sayaç açıkken görünür. Gerçekte ne sayıldığını doğru anlatıyor mu, son kez oku (ziyaret ve tamamlanan test sayısı, anonim).
- [ ] **Home metinleri** (`home.tagline`, `home.views`, `home.tests`): `tagline` şimdilik `test.subtitle` ile aynı geçici metin. Home için asıl cümleyi yaz.
- [ ] **Yazar bilgileri**: `config.js > AUTHOR` (isim, GitHub, LinkedIn, e-posta, hepsi yer tutucu) ve `footer.role` (iki dilde de yer tutucu).
- [ ] **Site adı** (`site.name`, `meta.title`): Geçici isim. Karar verilince iki dilde de güncelle.

### P1

- [ ] **İngilizce metinler** (hepsi): Ben çevirdim. Ana dili İngilizce olan biri okumalı, özellikle `about.*`.
- [ ] **Meta açıklaması** (`meta.description`): Sosyal medya / arama önizlemesinde görünecek, son hali yazılmalı.
- [ ] **WhatsApp paylaşım metni** (`share.text`): Tonu ve uzunluğu gerçek bir sohbette dene.
- [ ] **PDF özeti** (`print.title`, `print.note`): Doktora verildiğinde yeterli mi? Uyarı cümlesi ve kaynak (ölçek adı, sürüm) eklenebilir.
- [ ] **PDF ipucu** (`result.pdfTip`): Telefonda "PDF olarak kaydet" yönergesi farklı çalışıyor, mobil için ayrı ifade gerekebilir.
- [ ] **Test alt başlığı** (`test.subtitle`): "yaklaşık 2 dakika" gerçek kullanıcı süresiyle doğrula.
- [ ] **Hata / boş durumlar**: JS kapalı mesajı yalnızca İngilizce (`index.html > noscript`).

---

## 2. Eklenecek özellikler

### P0 (yayından önce)

- [ ] **Skorlama**: `config.js > SCORING` içine makaledeki katsayıları ve eşiği ekle, kaynağı koda yorum olarak yaz. Sonra `scoring.js` için birim testi (sınır değerleri: eşiğin tam üstü, tam altı, tüm 0, tüm maksimum).
- [ ] **Paylaşım önizlemesi**: `index.html` içine Open Graph ve Twitter etiketleri, önizleme görseli. WhatsApp'ta link tıklama oranını doğrudan etkiler. Not: tarayıcı botları `?lang=` göremeyeceği için önizleme tek dilli olur, hangi dilde olacağına karar ver.
- [ ] **Favicon** ve `theme-color`.
- [ ] **Sayacı canlıya bağla** (kod hazır, kapalı): GoatCounter'da site aç → kodu `config.js > STATS.goatcounterCode`'a yaz → site ayarlarında "Allow adding visitor counts on your website" seçeneğini aç. Yayında şunları doğrula, çünkü yalnızca sahte sunucuyla test edildi: (1) ziyaret ve test bitirme GoatCounter panelinde görünüyor (`/` ve `/test-completed`), (2) `/counter/%2F.json` tarayıcıdan CORS hatasız okunuyor, (3) Home'daki sayılar geliyor (sayaç yanıtı 4 saate kadar önbelleklenir, gecikme normal). Kendi tarayıcında `localStorage.setItem("skipgc","t")` çalıştır.
- [ ] **Yayına alma**: GitHub Pages veya Netlify, alan adı kararı, HTTPS kontrolü.
- [ ] **QR kartı**: Dağıtımda kullanılacak QR kodu ve basılacak kartın tasarımı (QR'ı link kesinleşince üret, kısa ve `?lang=tr` içeren sürümünü kullan).
- [ ] **Gerçek cihaz testi**: iOS Safari ve Android Chrome. Kazı-kazan dokunma, kaydırma, `window.print()`, header iki satır düzeni.

### P1

- [ ] **Doktora özet PDF'i iyileştirme**: tarih ve ölçek adı başlıkta, sayfa kenar boşlukları, tek sayfaya sığma, (eşik doğrulandıktan sonra) skorun eklenmesi. Mobilde yazdır → PDF akışını dene, gerekirse istemci tarafı PDF üretimini değerlendir.
- [ ] **Erişilebilirlik geçişi**: ekran okuyucu ile test akışı (radiogroup, ilerleme duyurusu), kontrast kontrolü (`--muted` açık ve koyu temada), odak sırası, `prefers-reduced-motion` altında kazı-kazan.
- [ ] **Kazı-kazan klavye ve ekran okuyucu yolu**: "Silmeden göster" butonu var, sonuç metni canvas'ın altında okunabilir. Yine de ekran okuyucuyla doğrula.
- [ ] **Arka plan shader'ı**: `background.css` ve `#bg` katmanına takılacak. Gerekenler: `prefers-reduced-motion` altında statik yedek, sekme gizliyken durdurma, mobilde performans sınırı, WebGL yoksa düz renk.
- [ ] **Yardım / kaynak bağlantıları**: Sonuç ekranında ya da narkolepsi bölümünde güvenilir kaynaklara linkler (Türkiye'ye uygun, doğrulanmış kurumlar). Link ve kurum listesi elle araştırılıp doğrulanmalı.
- [ ] **Dil seçimi kararı**: İlk ziyarette tarayıcı dili Türkçeyse Türkçe açılsın mı? Şu an yalnızca `?lang=` ve önceki seçim var, varsayılan İngilizce.
- [ ] **Yerelleştirme gözden geçirme**: Türkçe metinler son kez, İngilizce metinler ana dilli biri tarafından.

### P2

- [ ] **Üçüncü dil**: Yeni dil kuralı `ARCHITECTURE.md` bölüm 8'de. RTL bir dil (ör. Arapça) eklenecekse `dir` attribute'u ve CSS mantıksal özellikleri gerekir.
- [ ] **Manuel tema anahtarı** (açık/koyu): Şu an yalnızca sistem ayarını izliyor.
- [ ] **Test ilerlemesini saklama**: Sayfa yenilenince cevaplar kaybolur. `sessionStorage` ile saklamak mümkün ama gizlilik cümlesiyle çelişmemeli (cihazdan çıkmıyor, sekme kapanınca siliniyor).
- [ ] **Çevrimdışı kullanım**: Service worker ile. Sayfa tamamen statik olduğu için kolay.
- [ ] **Sayaç dışında analitik**: Kaynak (referrer), cihaz, ülke gibi veriler istenirse GoatCounter'ın kendi `count.js` scriptine geçmek gerekir (şu an üçüncü taraf script yok, referrer gönderilmiyor). Bu karar `footer.statsNote`'u ve gizlilik cümlelerini etkiler.
- [ ] **İstatistik kutusu eşiği**: Sayılar çok düşükken (ilk günler) kutu kötü görünebilir. `stats.js`'e "en az N görüntülenme olunca göster" eşiği eklenebilir. Şu an yalnızca ikisi de 0 ise gizleniyor.
- [ ] **Otomatik test**: Bu oturumdaki Playwright senaryosunu (dil değişimi, test akışı, sonuç, `?lang=`) repo içine al, CI'da çalıştır.
- [ ] **Narkolepsi bölümünü alt sayfalara / kartlara bölme**: İçerik uzarsa.

---

## 3. Bilinen sorunlar ve teknik borç

- [ ] **Menü vurgusu kayması** (`nav.js`): Test bölümünün başına gelince "Narkolepsi" linki hâlâ aktif görünebiliyor. `rootMargin` ya da bölüm üst boşluğu ayarlanmalı.
- [ ] **Çift metin kaynağı**: İngilizce yedek metinler hem `index.html` hem `locales/en.js` içinde. Bir derleme adımı eklemeden azaltmanın yolu yok, şimdilik elle senkron.
- [ ] **`1–5` tuşları** yalnızca test paneli odaktayken çalışıyor (`keydown` `#quiz-panel` üzerinde). Sayfada başka yerdeyken çalışmaz, bilerek böyle.
- [ ] **Tarayıcı desteği**: Top-level `await`, `inert` ve `color-mix` kullanılıyor. Eski tarayıcılarda (özellikle eski iOS Safari) sayfa açılmayabilir. Hedef kitleye göre alt sınır belirle, gerekirse `main.js` içindeki `await`'i kaldırıp promise zincirine çevir.
- [ ] **`localStorage` anahtarı** `"lang"` çok genel, alan adı paylaşılan bir ortamda çakışabilir. Önek eklemeyi düşün.
- [ ] **Dokümantasyon**: Yapı değiştikçe `ARCHITECTURE.md` güncel tutulmalı.

---

## 4. Yayın öncesi kontrol listesi

- [ ] Skor katsayıları ve eşik makaleyle doğrulandı, birim testi yazıldı
- [ ] Soru ve cevap metinleri orijinal ölçekle karşılaştırıldı
- [ ] Tıbbi içeriğin tamamı kaynaklı
- [ ] Yer tutucu hiçbir metin kalmadı (`config.js`, `footer.role`, `narcolepsy.body`, `references.js`, `home.tagline`, `messages.neutral`)
- [ ] Her iki dilde baştan sona manuel geçiş yapıldı
- [ ] Gerçek telefonda test (iOS + Android), açık ve koyu tema
- [ ] Paylaşım önizlemesi WhatsApp'ta kontrol edildi
- [ ] PDF çıktısı bir kez gerçekten doktora götürülebilecek halde mi, bakıldı
- [ ] Alan adı ve HTTPS çalışıyor
