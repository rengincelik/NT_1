# Yapılacaklar

Öncelik: **P0** yayından önce şart · **P1** yayından hemen sonra / mümkünse önce · **P2** sonra.
Dosya yolları ve anahtar adları `ARCHITECTURE.md` ile uyumlu.
Son güncelleme: 2026-11-12

---

## 1. Düzenlenmesi gereken metinler

Metinler `js/locales/en.js` ve `js/locales/tr.js` içinde. Test metinleri `tests.<id>` altında (`tests.sns`, `tests.ess`). ESS'in yönerge, madde, seçenek ve telif metinleri lisanslıdır, düzenlenmez (`ARCHITECTURE.md` bölüm 3).

Genel metin gözden geçirmesi bitti (2026-11-12): footer notu, sayaç notu, site adı, İngilizce metinler, meta açıklaması, test alt başlıkları, yerelleştirme.

### Açık kalanlar

- [ ] **`noscript` mesajı** (`index.html`): Yalnızca İngilizce, TR için ayrı metin yok. JS kapalıyken i18n çalışmadığı için ya iki dilli yaz ya da bilerek İngilizce bırak.
- [ ] **SNS sonuç mesajları** (`tests.sns.messages.suspect`, `unlikely`): Skorlama bitince yeniden oku (bkz. 2. bölüm, Skorlama). Özellikle `unlikely` "sorun yok" izlenimi vermemeli.

---

## 2. Eklenecek özellikler

### P0 (yayından önce)

- [ ] **Skorlama** (başlanmadı): `config.js > TESTS.sns.scoring` içine makaledeki katsayıları ve eşiği ekle, kaynağı koda yorum olarak yaz. Sonra `scoring.js` için birim testi (sınır değerleri: eşiğin tam üstü, tam altı, tüm 0, tüm maksimum, ayrıca `bands` biçimi: bant sınırları ve en düşük bandın altı). Eşik gelince SNS sonuç mesajlarını (`tests.sns.messages.suspect`, `unlikely`) yeniden oku ve geçici `neutral` mesajını kaldır ya da hata durumuna çevir (`threshold` doluyken kullanılmaz).

- [ ] **WhatsApp paylaşım önizleme görseli çıkmıyor**: Kontrol sırası:
  - `assets/og-image.png` repoda var mı, Pages'e yayınlandı mı? (`ARCHITECTURE.md` klasör yapısında yalnızca `assets/flags/` görünüyor.) `https://rengincelik.github.io/NT_1/assets/og-image.png` adresini tarayıcıda doğrudan aç.
  - Boyut 1200×630, dosya küçük olsun (WhatsApp için ~300 KB altı güvenli, 600 KB üstü çoğu zaman gösterilmez). Mutlak `https://` adres, dosya adı büyük/küçük harf uyumlu (Pages büyük/küçük harfe duyarlı).
  - WhatsApp önizlemeyi önbelleğe alır. Düzeltme sonrası görseli yeni dosya adıyla ya da `?v=2` ile ver, linki yeni (parametreli) halde dene. Facebook Sharing Debugger ile önbelleği yenile.
  - `og:*` etiketleri statik ve Türkçe, `<title>` / `description` ise İngilizce. Paylaşım dile göre değişmiyor (crawler JS çalıştırmaz). Karar ver: tek dil mi kalsın, ya da `?lang=` için ayrı sayfa mı gerekir. En azından `og:title` / `description` ile `<title>` / `description` tutarlı olsun. (Açıklamada hâlâ yalnızca "Swiss Narcolepsy Scale" geçiyor, ESS de var.)
  - `og:image:alt` ve `twitter:image` aynı dosyayı gösteriyor, birlikte düzelir.

- [ ] **Favicon** ve `theme-color` (açık ve koyu tema için `media` özellikli iki etiket ya da `theme.js`'ten güncelleme).
- 
- [ ] **Worker dokümanları**: `worker/README.md` ve `worker/schema.sql` içinde eski `POST /tally/test` rotası ya da "iki satır (`views`, `tests`)" anlatımı varsa güncelle (test başına `test_<id>` satırı, satırlar ilk artırmada oluşur). Bu dosyalar kontrol edilmedi.
- [ ] **Reklam engelleyici testi**: Worker yayında uBlock Origin / AdGuard / Brave kalkanı açıkken sayfayı aç, `workers.dev` isteği engelleniyor mu bak. Engelleniyorsa çözüm: Worker'ı kendi alan adına bağlamak (nötr bir alt alan adı).

- [ ] **QR kartı**: Dağıtımda kullanılacak QR kodu ve basılacak kartın tasarımı (QR'ı link kesinleşince üret, kısa ve `?lang=tr` içeren sürümünü kullan).
- [ ] **Gerçek cihaz testi**: iOS Safari ve Android Chrome. Kazı-kazan dokunma, kaydırma, `window.print()`, header iki satır düzeni (bayraklar + tema butonu), tarayıcı/sistem dili ve temasının otomatik gelmesi.

### P1

- [ ] **Test başına sayıları gösterme (isteğe bağlı)**: Worker `byTest` döndürüyor, ekranda yalnızca toplam var.

- [ ] **Erişilebilirlik geçişi**: ekran okuyucu ile test akışı (radiogroup, ilerleme duyurusu), kontrast kontrolü (`--muted` açık ve koyu temada), odak sırası, `prefers-reduced-motion` altında kazı-kazan. Test değiştirince soru ekranları yeniden kurulduğu için odak ve duyuru davranışı da kontrol edilmeli. Tema butonu (`aria-pressed` + etiket) ekran okuyucuyla doğrulanmalı.
- [ ] **Arka plan shader'ı**: `background.css` ve `#bg` katmanına takılacak. Gerekenler: `prefers-reduced-motion` altında statik yedek, sekme gizliyken durdurma, mobilde performans sınırı, WebGL yoksa düz renk, iki temaya uyum.

### P2

- [ ] **Üçüncü dil**: Yeni dil kuralı `ARCHITECTURE.md` bölüm 8'de. RTL bir dil (ör. Arapça) eklenecekse `dir` attribute'u ve CSS mantıksal özellikleri gerekir.
- [ ] **Temada "sistemi izle" seçeneği**: Şu an butonla bir kez seçim yapılınca tercih kalıcı, sistem temasına geri dönmenin yolu yok (yalnızca `localStorage["theme"]`'i silmek). Üçüncü durum (sistem / açık / koyu) ya da uzun basma gibi bir yol eklenebilir.
- [ ] **Test ilerlemesini saklama**: Sayfa yenilenince cevaplar kaybolur (tüm testler için). `sessionStorage` ile saklamak mümkün ama gizlilik cümlesiyle çelişmemeli (cihazdan çıkmıyor, sekme kapanınca siliniyor).
- [ ] **Çevrimdışı kullanım**: Service worker ile. Sayfa tamamen statik olduğu için kolay.
- [ ] **GoatCounter'ın geleceği**: Şu an yalnızca arka planda sayım yapıyor, sayılar Worker'dan geliyor. Panel verisi (referrer, cihaz) istenirse GoatCounter'ın kendi `count.js` scriptine geçmek gerekir (şu an üçüncü taraf script yok, referrer gönderilmiyor), bu `footer.statsNote`'u etkiler. İstenmezse `goatcounterCode`'u boşaltmak yeter.
- [ ] **Worker'da kötüye kullanım sınırı**: IP başına sınır yok, `Origin` başlığını taklit eden biri sayıyı artırabilir. Sorun olursa Cloudflare'ın ücretsiz hız sınırlama kuralı ya da Worker içinde basit bir sınır eklenebilir.

- [ ] **Otomatik test**: Playwright senaryosunu (dil değişimi, test akışı, sonuç, `?lang=`, test değiştirme) repo içine al, CI'da çalıştır. Çoklu test için senaryo: iki test arasında geçiş, cevapların korunması, bitirilmiş testin sonucunun geri gelmesi, düzenle / baştan başla. Tema ve dil için: tarayıcı dili (`locale`) ve `colorScheme` emülasyonuyla varsayılanın doğru gelmesi, butonla seçimin kalıcı olması, `?lang=` ve kayıtlı seçimin tarayıcı dilini ezmesi.

---

## 3. Bilinen sorunlar ve teknik borç


- [ ] **Koyu tema değişkenleri iki yerde** (`base.css`): Media query bloğu ve `:root[data-theme="dark"]` aynı değerleri tekrar eder, elle senkron. Renk değişince ikisini birlikte güncelle.
- [ ] **Sayı tuşları** (`1..n`) yalnızca test paneli odaktayken çalışıyor (`keydown` `#quiz-panel` üzerinde). Sayfada başka yerdeyken çalışmaz, bilerek böyle.
- [ ] **`localStorage` anahtarları** `"lang"` ve `"theme"` çok genel, alan adı paylaşılan bir ortamda çakışabilir (GitHub Pages'te `rengincelik.github.io` altındaki diğer projelerle aynı origin paylaşılır, bu yüzden gerçek bir risk). Önek eklemeyi düşün (tema anahtarı `index.html` içindeki satır içi scriptte de geçtiği için ikisini birlikte değiştir).
- [ ] **Test kimliği iki yerde**: `config.js > TESTS` ve `worker/src/index.js > TEST_IDS` elle senkron tutuluyor. Eşleşmezse o testin sayımı Worker'da 404 alır (sayfa bozulmaz).
- [ ] **Dokümantasyon**: Yapı değiştikçe `ARCHITECTURE.md` güncel tutulmalı.

---

## 4. Yayın öncesi kontrol listesi

- [ ] Skor katsayıları ve eşik makaleyle doğrulandı, birim testi yazıldı
- [ ] Yer tutucu hiçbir metin kalmadı (`config.js`, `footer.role`, `home.tagline`, `tests.*.messages.neutral`)
- [ ] `config.js > TESTS` ile `worker/src/index.js > TEST_IDS` aynı ve Worker yeniden yayınlandı
- [ ] Her iki dilde baştan sona manuel geçiş yapıldı
- [ ] Gerçek telefonda test (iOS + Android), açık ve koyu tema
- [ ] Paylaşım önizlemesi WhatsApp'ta kontrol edildi (şu an görsel çıkmıyor, bkz. 2. bölüm)
- [ ] Alan adı ve HTTPS çalışıyor