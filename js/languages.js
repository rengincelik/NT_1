// Dil kaydı. Yeni dil eklemek için:
//   1) js/locales/<kod>.js dosyasını oluştur (en.js'i kopyalayıp çevir)
//   2) assets/flags/<kod>.svg bayrağını koy
//   3) aşağıya bir satır ekle
// Eksik anahtarlar otomatik olarak varsayılan dilden (DEFAULT_LANG) gelir.

export const DEFAULT_LANG = "en";

export const LANGUAGES = [
  { code: "en", name: "English", flag: "assets/flags/en.svg", load: () => import("./locales/en.js") },
  { code: "tr", name: "Türkçe",  flag: "assets/flags/tr.svg", load: () => import("./locales/tr.js") },
];
