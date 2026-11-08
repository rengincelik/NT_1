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

// Soru ve seçenek sayısı. Dil dosyalarındaki questions ve scale dizileri bununla aynı uzunlukta olmalı.
export const QUIZ = {
  questionCount: 5,
  scaleSize: 5,
};

// TODO: weights ve threshold GEÇİCİ. Orijinal SNS makalesinden (Sturzenegger ve ark., 2013)
// doğrulanmadan kullanma. threshold null iken sayfa "şüpheli / değil" kararı vermez.
export const SCORING = {
  weights: [1, 1, 1, 1, 1],
  threshold: null,
};
