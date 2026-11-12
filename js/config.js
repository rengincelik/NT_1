// Dilden bağımsız ayarlar. Metinler js/locales/ altında.

// Alt bilgi: kendi bilgilerini buraya yaz (açıklama ve not metni dil dosyalarında)
export const AUTHOR = {
  name: "Rengin Çelik",
  links: [
    { label: "GitHub", url: "https://github.com/rengincelik" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/rengincelik/" },
    { label: "Email", url: "mailto:rengin.celik97@gmail.com" },
  ],
};

// Testler. Her test kendi soru/seçenek sayısına, kendi skorlamasına ve kendi sayacına sahiptir.
// Anahtar (id) aynı zamanda dil dosyasındaki yolu (tests.<id>.*) ve Worker'daki sayaç adını belirler.
//
// Dil dosyalarında tests.<id>.questions ve tests.<id>.scale dizileri questionCount / scaleSize ile aynı uzunlukta olmalı.
//
// İsteğe bağlı alanlar:
//   keyBase   : seçenek numarasının başladığı değer ve sayı tuşu eşlemesi (varsayılan 1: 1..n). ESS gibi 0'dan başlayan ölçekler için 0.
//   showScore : true ise sonuçta ve PDF özetinde "Skor: X / Y" gösterilir (ağırlıklı toplam, en yüksek skor ağırlıklardan hesaplanır).
//   scoring.constant     : formüldeki sabit terim (varsayılan 0).
//   scoring.answerOffset : cevap değerine eklenen sayı; ölçek 1'den başlıyorsa 1 (varsayılan 0).
// Metin tarafında isteğe bağlı: tests.<id>.scales.<soru>.<değer> (tek bir sorunun kendi seçenekleri), tests.<id>.intro[] (sorulardan önce gösterilen yönerge paragrafları),
// tests.<id>.copyright (test panelinin altında ve PDF özetinde gösterilen telif/lisans satırı).
//
// scoring iki biçimden birini alır (scoring.js):
//   { weights, threshold }  → "suspect" | "unlikely" ("neutral": threshold null iken). Skor >= threshold şüpheli;
//                             suspectBelow: true ise skor < threshold şüpheli.
//   { weights, bands }      → bands: [{ min, key }, ...] artan min sırasıyla; skor >= min olan son bandın key'i kullanılır.
//                             key, dil dosyasında tests.<id>.messages.<key> olmalı.
//
// Yeni test eklemek için ARCHITECTURE.md > "Yeni test ekleme".
export const TESTS = {
  sns: {
    questionCount: 5,
    scaleSize: 5,
    // Swiss Narcolepsy Scale. Sorular ve formül: Sturzenegger ve ark., Clin Transl Neurosci 2018;2:1-5 (Tablo 1).
    // Türkçe geçerlik çalışması aynı formülü kullanır: Demir ve ark., Clin Transl Neurosci 2023;7:16 (SNS-TR).
    // Skor = 6×Q1 + 9×Q2 − 5×Q3 − 11×Q4 − 13×Q5 + 20, cevaplar 1–5. Skor < 0 → katapleksili narkolepsi (NT1) şüphesi.
    // Arayüz cevapları 0–4 verir, makale 1–5 kullanır: answerOffset 1. Skor 0 şüpheli sayılmaz (makalenin kesimi "< 0").
    // Ham skor (−110…66) kullanıcıya anlam taşımadığı için showScore kapalı.
    scoring: {
      weights: [6, 9, -5, -11, -13],
      constant: 20,
      answerOffset: 1,
      threshold: 0,
      suspectBelow: true,
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

export const STATS = {
	workerUrl: "https://narkolepsi-tally.rengincelik.workers.dev",
	// goatcounterCode: "rcelik",
  paths: { view: "/", testDone: "/test-completed/{id}" },
};