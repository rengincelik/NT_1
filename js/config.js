// Dilden bağımsız ayarlar. Metinler js/locales/ altında.

// Alt bilgi: kendi bilgilerini buraya yaz (açıklama ve not metni dil dosyalarında)
export const AUTHOR = {
  name: "Adın Soyadın",
  links: [
    { label: "GitHub", url: "#" },
    { label: "LinkedIn", url: "#" },
    { label: "Email", url: "mailto:ornek@ornek.com" },
  ],
};

// Testler. Her test kendi soru/seçenek sayısına, kendi skorlamasına ve kendi sayacına sahiptir.
// Anahtar (id) aynı zamanda dil dosyasındaki yolu (tests.<id>.*) ve Worker'daki sayaç adını belirler.
//
// Dil dosyalarında tests.<id>.questions ve tests.<id>.scale dizileri questionCount / scaleSize ile aynı uzunlukta olmalı.
// Cevap değeri = seçeneğin sırası (0'dan başlar). scoring.weights.length = questionCount.
//
// İsteğe bağlı alanlar:
//   keyBase   : seçenek numarasının başladığı değer ve sayı tuşu eşlemesi (varsayılan 1: 1..n). ESS gibi 0'dan başlayan ölçekler için 0.
//   showScore : true ise sonuçta ve PDF özetinde "Skor: X / Y" gösterilir (ağırlıklı toplam, en yüksek skor ağırlıklardan hesaplanır).
// Metin tarafında isteğe bağlı: tests.<id>.intro[] (sorulardan önce gösterilen yönerge paragrafları),
// tests.<id>.copyright (test panelinin altında ve PDF özetinde gösterilen telif/lisans satırı).
//
// scoring iki biçimden birini alır (scoring.js):
//   { weights, threshold }  → "suspect" | "unlikely" ("neutral": threshold null iken)
//   { weights, bands }      → bands: [{ min, key }, ...] artan min sırasıyla; skor >= min olan son bandın key'i kullanılır.
//                             key, dil dosyasında tests.<id>.messages.<key> olmalı.
//
// Yeni test eklemek için ARCHITECTURE.md > "Yeni test ekleme".
export const TESTS = {
  sns: {
    questionCount: 5,
    scaleSize: 5,
    // TODO: weights ve threshold GEÇİCİ. Orijinal SNS makalesinden (Sturzenegger ve ark., 2013)
    // doğrulanmadan kullanma. threshold null iken sayfa "şüpheli / değil" kararı vermez.
    scoring: {
      weights: [1, 1, 1, 1, 1],
      threshold: null,
    },
  },

  // Epworth Uykululuk Ölçeği (ESS) v1.0. © MW Johns 1990-1997, Mapi Research Trust lisansıyla kullanılır.
  // Puanlama: "ESS Scaling and Scoring v2.0, Ağustos 2017" (Mapi Research Trust). 8 madde, 0-3, ağırlık yok, skor = toplam (0-24).
  // Bantlar (yazarın yorumu): 0-5 düşük normal, 6-10 yüksek normal, 11-12 hafif, 13-15 orta, 16-24 ağır aşırı gündüz uykululuğu.
  // Eksik madde olursa form geçersiz sayılır: quiz.js tüm maddeler cevaplanmadan bitirmeye izin vermez.
  ess: {
    questionCount: 8,
    scaleSize: 4,
    keyBase: 0,
    showScore: true,
    scoring: {
      weights: [1, 1, 1, 1, 1, 1, 1, 1],
      bands: [
        { min: 0, key: "lowerNormal" },
        { min: 6, key: "higherNormal" },
        { min: 11, key: "mild" },
        { min: 13, key: "moderate" },
        { min: 16, key: "severe" },
      ],
    },
  },
};

// Sayfa ilk açıldığında seçili test. TESTS içinde olmalı.
export const DEFAULT_TEST = "sns";

// Sayaç (GoatCounter, ücretsiz). goatcounterCode boşken sayaç tamamen kapalıdır.
// Kurulum: goatcounter.com'da site aç, kodu buraya yaz (ör. "narkolepsi" → narkolepsi.goatcounter.com),
// site ayarlarında "Allow adding visitor counts on your website" seçeneğini aç.
export const STATS = {
  goatcounterCode: "rcelik",
  // {id} test kimliğiyle değişir (ör. /test-completed/sns). Her test GoatCounter'da ayrı yol olarak görünür.
  paths: { view: "/", testDone: "/test-completed/{id}" },
};