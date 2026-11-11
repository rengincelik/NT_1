# Yapılacaklar

Öncelik: **P0** yayından önce şart · **P1** yayından hemen sonra / mümkünse önce · **P2** sonra.
Dosya yolları ve anahtar adları `ARCHITECTURE.md` ile uyumlu.

---

## 1. Düzenlenmesi gereken metinler

Metinler `js/locales/en.js` ve `js/locales/tr.js` içinde. Test metinleri `tests.<id>` altında (`tests.sns`, `tests.ess`). ESS'in yönerge, madde, seçenek ve telif metinleri lisanslıdır, düzenlenmez (`ARCHITECTURE.md` bölüm 3). `data-i18n` ile bağlı İngilizce metinlerin yedeği `index.html` içinde de duruyor, ikisi birlikte güncellenmeli.

### P0

- [ ] **Soru metinleri** (`tests.sns.questions`): Orijinal SNS makalesindeki (Sturzenegger ve ark., 2013) ifadelerle karşılaştır. Şu an Türkçesi birebir çeviri değil, İngilizcesi Türkçeden türetilmiş. Sorular resmî bir çevirisi varsa ona çekilmeli.
- [ ] **Cevap etiketleri** (`tests.sns.scale`): Orijinal ölçeğin cevap formatıyla karşılaştır. Şu an 5 kademeli frekans etiketi kullanılıyor, orijinal ölçek farklı olabilir.
- [ ] **Sonuç mesajları** (`tests.sns.messages.suspect`, `tests.sns.messages.unlikely`): Eşik netleşince yeniden yaz. Özellikle `unlikely` mesajı "sorun yok" izlenimi vermemeli.
- [ ] **Sonuç mesajı** (`tests.sns.messages.neutral`): Geçici metin. Eşik eklenince bu durum kullanılmayacak, kaldırılacak ya da bir hata durumuna çevrilecek.
- [ ] **Hakkında metni** (`about.p1`): "Türkiye'de binlerce insan" iddiası kaynaklı değil. Kaynak bulup rakamı düzelt ya da ifadeyi yumuşat. Aynı iddia İngilizce sürümünde de var.
- [ ] **Hakkında metni** (`about.p2`): "Klinikte kullanılan" ifadesi doğrulanmalı (ölçeğin hangi amaçla kullanıldığı, ön tarama mı, tanı destek mi).
- [ ] **ESS lisans koşulları**: Mapi Research Trust lisansındaki koşulları koddaki kullanımla karşılaştır. Özellikle: metnin değiştirilmemesi (formdaki "aşağıdaki ölçeği kullanın" cümlesi ve 0–3 açıklaması yerine seçenekler etiketli ve numaralı gösteriliyor, form kutuları yok, yönergenin diğer dört cümlesi birebir), telif satırının yeri ve biçimi (şu an test panelinin altı ve PDF özeti), istenen ek atıf ya da Mapi bildirimi, Türkçe çeviri için atıf, çevrimiçi kullanım şartı, skorun ve bant adlarının gösterilmesine izin, başvuruda belirtilen kullanım alanı ve süre.
- [ ] **ESS mesaj metinleri** (`tests.ess.messages.*.body`, `tests.ess.print.note`): Lisanslı değil, benim taslağım, her iki dilde gözden geçir. Sürüş uyarısı (orta ve ağır bantlarda) ve "hekime başvur" tonunu onayla. Mesaj başlıkları (yazarın bant adları) PDF'te skor satırının yanında da çıkıyor, başlıkları değiştirirsen oraya da bak.
- [ ] **ESS'i anlatan metinler**: `about.p2` ve `home.tagline` yalnızca 5 soruluk SNS'i anlatıyor, iki testi anlatacak şekilde güncelle. `narcolepsy.body` içine ESS paragrafı (genel gündüz uykululuğunu ölçer, narkolepsiye özgü değildir), `references.js`'e ESS kaynağı (Johns, Sleep 1991, künyeyi doğrulayarak) ve Türkçe sürümün geçerlik çalışması, `footer.note` gerekiyorsa.
- [ ] **Narkolepsi bölümü** (`narcolepsy.body`): Şu an geçici metin. İçerik yazılacak, tıbbi bilgiler doğrulanmış kaynaklardan alınacak, alıntılar `[@anahtar]` ile eklenecek.
- [ ] **Geçici kaynaklar** (`js/references.js`: `placeholder-1`, `placeholder-2`): Gerçek künye ve linklerle değiştir, kullanılmayanları sil.
- [ ] **Hakkımda metinlerinde alıntı** (`about.p1`, `about.p2`, ...): Yukarıdaki iddialar için kaynak eklenince `[@anahtar]` ile bağla.
- [ ] **Footer notu** (`footer.note`): Hukuki/tıbbi sorumluluk reddi son kez gözden geçirilmeli. "Cevapların hiçbir yere kaydedilmez" cümlesi, cevapları gönderen bir özellik eklenirse yanlış olur.
- [ ] **Sayaç notu** (`footer.statsNote`): Yalnızca sayaç açıkken görünür. Gerçekte ne sayıldığını doğru anlatıyor mu, son kez oku (ziyaret ve tamamlanan test sayısı, anonim). Not: artık hangi testin bittiği de sayılıyor (test başına sayaç), metin bunu kapsıyor mu bak.
- [ ] **Home metinleri** (`home.tagline`, `home.views`, `home.tests`): `tagline` şimdilik `tests.sns.subtitle` ile aynı geçici metin. Home için asıl cümleyi yaz.
- [ ] **Yazar bilgileri**: `config.js > AUTHOR` (isim, GitHub, LinkedIn, e-posta, hepsi yer tutucu) ve `footer.role` (iki dilde de yer tutucu).
- [ ] **Site adı** (`site.name`, `meta.title`): Geçici isim. Karar verilince iki dilde de güncelle.

### P1

- [ ] **İngilizce metinler** (hepsi): Ben çevirdim. Ana dili İngilizce olan biri okumalı, özellikle `about.*`.
- [ ] **Meta açıklaması** (`meta.description`): Sosyal medya / arama önizlemesinde görünecek, son hali yazılmalı.
- [ ] **WhatsApp paylaşım metni** (`share.text`): Tonu ve uzunluğu gerçek bir sohbette dene.
- [ ] **PDF özeti** (`tests.sns.print.title`, `tests.sns.print.note`): Doktora verildiğinde yeterli mi? Uyarı cümlesi ve kaynak (ölçek adı, sürüm) eklenebilir.
- [ ] **PDF ipucu** (`result.pdfTip`): Telefonda "PDF olarak kaydet" yönergesi farklı çalışıyor, mobil için ayrı ifade gerekebilir.
- [ ] **Test alt başlıkları** (`tests.sns.subtitle`, `tests.ess.subtitle`): "yaklaşık 2 dakika" gerçek kullanıcı süresiyle doğrula (ESS 8 soru).
- [ ] **Hata / boş durumlar**: JS kapalı mesajı yalnızca İngilizce (`index.html > noscript`).

---

## 2. Eklenecek özellikler

### P0 (yayından önce)

- [ ] **Skorlama**: `config.js > TESTS.sns.scoring` içine makaledeki katsayıları ve eşiği ekle, kaynağı koda yorum olarak yaz. Sonra `scoring.js` için birim testi (sınır değerleri: eşiğin tam üstü, tam altı, tüm 0, tüm maksimum, ayrıca `bands` biçimi: bant sınırları ve en düşük bandın altı).
- [ ] **Paylaşım önizlemesi**: `index.html` içine Open Graph ve Twitter etiketleri, önizleme görseli. WhatsApp'ta link tıklama oranını doğrudan etkiler. Not: tarayıcı botları `?lang=` göremeyeceği için önizleme tek dilli olur, hangi dilde olacağına karar ver.
- [ ] **Favicon** ve `theme-color`.
- [ ] **Sayaç Worker'ını yayınla** (kod hazır ve yerelde test edildi, `worker/README.md`): D1 oluştur, `wrangler.toml > database_id` ve `ALLOWED_ORIGINS` (yayın adresin) doldur, `wrangler deploy`, çıkan adresi `config.js > STATS.workerUrl`'a yaz. Yayında doğrula: Home'da sayılar geliyor, test bitirince "tamamlanan test" artıyor. Kendi tarayıcında `localStorage.setItem("skipgc","t")` çalıştır. Test sayacı rotası artık `POST /tally/test/<id>`, `worker/src/index.js > TEST_IDS` (`sns`, `ess`) `config.js > TESTS` ile aynı olmalı. ESS eklendiği için Worker'ı yeniden yayınlamadan ESS sayımı Worker'da 404 alır (sayfa bozulmaz). Yayından sonra her iki testi bitirip Home'daki toplamın ve GoatCounter'daki `/test-completed/sns` ve `/test-completed/ess` yollarının arttığını doğrula.
- [ ] **Worker dokümanları**: `worker/README.md` ve `worker/schema.sql` içinde eski `POST /tally/test` rotası ya da "iki satır (`views`, `tests`)" anlatımı varsa güncelle (test başına `test_<id>` satırı, satırlar ilk artırmada oluşur). Bu dosyalar çoklu test değişikliği sırasında elde değildi, kontrol edilmedi.
- [ ] **Reklam engelleyici testi**: Worker yayında uBlock Origin / AdGuard / Brave kalkanı açıkken sayfayı aç, `workers.dev` isteği engelleniyor mu bak. Engelleniyorsa sayılar düşük kalır, çözüm: Worker'ı kendi alan adına bağlamak (`stats` benzeri alt alan adı yerine nötr bir ad).
- [ ] **Yayına alma**: GitHub Pages veya Netlify, alan adı kararı, HTTPS kontrolü.
- [ ] **QR kartı**: Dağıtımda kullanılacak QR kodu ve basılacak kartın tasarımı (QR'ı link kesinleşince üret, kısa ve `?lang=tr` içeren sürümünü kullan).
- [ ] **Gerçek cihaz testi**: iOS Safari ve Android Chrome. Kazı-kazan dokunma, kaydırma, `window.print()`, header iki satır düzeni.

### P1

- [ ] **Test seçici ve ESS görünümü**: Artık iki test var, `#test-switch` (iki buton, mevcut `.btn` sınıfları), `#test-intro` (4 paragraf yönerge), `#test-copyright` ve `.result-score` satırı gerçek tasarımda ve mobilde nasıl duruyor bak, gerekirse `components.css` / `layout.css`'e küçük bir kural ekle. Akış sahte yardımcı modüllerle gerçek tarayıcıda denendi (İngilizce ve Türkçe), gerçek CSS ile görsel olarak bakılmadı.
- [ ] **Test başına sayıları gösterme (isteğe bağlı)**: Worker `byTest` döndürüyor, ekranda yalnızca toplam var. İstenirse Home'da ya da test kartında test başına sayı.
- [ ] **Doktora özet PDF'i iyileştirme**: tarih ve ölçek adı başlıkta, sayfa kenar boşlukları, tek sayfaya sığma, (eşik doğrulandıktan sonra) skorun eklenmesi. Mobilde yazdır → PDF akışını dene, gerekirse istemci tarafı PDF üretimini değerlendir.
- [ ] **Erişilebilirlik geçişi**: ekran okuyucu ile test akışı (radiogroup, ilerleme duyurusu), kontrast kontrolü (`--muted` açık ve koyu temada), odak sırası, `prefers-reduced-motion` altında kazı-kazan. Test değiştirince soru ekranları yeniden kurulduğu için odak ve duyuru davranışı da kontrol edilmeli.
- [ ] **Kazı-kazan klavye ve ekran okuyucu yolu**: "Silmeden göster" butonu var, sonuç metni canvas'ın altında okunabilir. Yine de ekran okuyucuyla doğrula.
- [ ] **Arka plan shader'ı**: `background.css` ve `#bg` katmanına takılacak. Gerekenler: `prefers-reduced-motion` altında statik yedek, sekme gizliyken durdurma, mobilde performans sınırı, WebGL yoksa düz renk.
- [ ] **Yardım / kaynak bağlantıları**: Sonuç ekranında ya da narkolepsi bölümünde güvenilir kaynaklara linkler (Türkiye'ye uygun, doğrulanmış kurumlar). Link ve kurum listesi elle araştırılıp doğrulanmalı.
- [ ] **Dil seçimi kararı**: İlk ziyarette tarayıcı dili Türkçeyse Türkçe açılsın mı? Şu an yalnızca `?lang=` ve önceki seçim var, varsayılan İngilizce.
- [ ] **Yerelleştirme gözden geçirme**: Türkçe metinler son kez, İngilizce metinler ana dilli biri tarafından.

### P2

- [ ] **Üçüncü dil**: Yeni dil kuralı `ARCHITECTURE.md` bölüm 8'de. RTL bir dil (ör. Arapça) eklenecekse `dir` attribute'u ve CSS mantıksal özellikleri gerekir.
- [ ] **Manuel tema anahtarı** (açık/koyu): Şu an yalnızca sistem ayarını izliyor.
- [ ] **Test ilerlemesini saklama**: Sayfa yenilenince cevaplar kaybolur (tüm testler için). `sessionStorage` ile saklamak mümkün ama gizlilik cümlesiyle çelişmemeli (cihazdan çıkmıyor, sekme kapanınca siliniyor).
- [ ] **Çevrimdışı kullanım**: Service worker ile. Sayfa tamamen statik olduğu için kolay.
- [ ] **GoatCounter'ın geleceği**: Şu an yalnızca arka planda sayım yapıyor, sayılar Worker'dan geliyor. Panel verisi (referrer, cihaz) istenirse GoatCounter'ın kendi `count.js` scriptine geçmek gerekir (şu an üçüncü taraf script yok, referrer gönderilmiyor), bu `footer.statsNote`'u etkiler. İstenmezse `goatcounterCode`'u boşaltmak yeter.
- [ ] **Worker'da kötüye kullanım sınırı**: IP başına sınır yok, `Origin` başlığını taklit eden biri sayıyı artırabilir. Sorun olursa Cloudflare'ın ücretsiz hız sınırlama kuralı ya da Worker içinde basit bir sınır eklenebilir.
- [ ] **İstatistik kutusu eşiği**: Sayılar çok düşükken (ilk günler, reklam engelleyici etkisi) kutu kötü görünebilir. `stats.js > render`'a "en az N görüntülenme olunca göster" eşiği eklenebilir. Şu an yalnızca ikisi de 0 ise gizleniyor.
- [ ] **Otomatik test**: Bu oturumdaki Playwright senaryosunu (dil değişimi, test akışı, sonuç, `?lang=`, test değiştirme) repo içine al, CI'da çalıştır. Çoklu test için senaryo: iki test arasında geçiş, cevapların korunması, bitirilmiş testin sonucunun geri gelmesi, düzenle / baştan başla.
- [ ] **Narkolepsi bölümünü alt sayfalara / kartlara bölme**: İçerik uzarsa.

---

## 3. Bilinen sorunlar ve teknik borç

- [ ] **Menü vurgusu kayması** (`nav.js`): Test bölümünün başına gelince "Narkolepsi" linki hâlâ aktif görünebiliyor. `rootMargin` ya da bölüm üst boşluğu ayarlanmalı.
- [ ] **Çift metin kaynağı**: İngilizce yedek metinler hem `index.html` hem `locales/en.js` içinde. Bir derleme adımı eklemeden azaltmanın yolu yok, şimdilik elle senkron. `#test-subtitle` ve `#quiz-tip` yedekleri yalnızca varsayılan testin (SNS) İngilizce metnini taşır.
- [ ] **Sayı tuşları** (`1..n`) yalnızca test paneli odaktayken çalışıyor (`keydown` `#quiz-panel` üzerinde). Sayfada başka yerdeyken çalışmaz, bilerek böyle.
- [ ] **Tarayıcı desteği**: Top-level `await`, `inert` ve `color-mix` kullanılıyor. Eski tarayıcılarda (özellikle eski iOS Safari) sayfa açılmayabilir. Hedef kitleye göre alt sınır belirle, gerekirse `main.js` içindeki `await`'i kaldırıp promise zincirine çevir.
- [ ] **`localStorage` anahtarı** `"lang"` çok genel, alan adı paylaşılan bir ortamda çakışabilir. Önek eklemeyi düşün.
- [ ] **Test kimliği iki yerde**: `config.js > TESTS` ve `worker/src/index.js > TEST_IDS` elle senkron tutuluyor. Eşleşmezse o testin sayımı Worker'da 404 alır (sayfa bozulmaz).
- [ ] **Dokümantasyon**: Yapı değiştikçe `ARCHITECTURE.md` güncel tutulmalı.

---

## 4. Yayın öncesi kontrol listesi

- [ ] Skor katsayıları ve eşik makaleyle doğrulandı, birim testi yazıldı
- [ ] Soru ve cevap metinleri orijinal ölçekle karşılaştırıldı (SNS)
- [ ] ESS lisans koşulları kodla karşılaştırıldı (telif satırı, atıf, metin değişikliği yok)
- [ ] Tıbbi içeriğin tamamı kaynaklı
- [ ] Yer tutucu hiçbir metin kalmadı (`config.js`, `footer.role`, `narcolepsy.body`, `references.js`, `home.tagline`, `tests.*.messages.neutral`)
- [ ] `config.js > TESTS` ile `worker/src/index.js > TEST_IDS` aynı ve Worker yeniden yayınlandı
- [ ] Her iki dilde baştan sona manuel geçiş yapıldı
- [ ] Gerçek telefonda test (iOS + Android), açık ve koyu tema
- [ ] Paylaşım önizlemesi WhatsApp'ta kontrol edildi
- [ ] PDF çıktısı bir kez gerçekten doktora götürülebilecek halde mi, bakıldı
- [ ] Alan adı ve HTTPS çalışıyor
