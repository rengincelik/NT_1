// Saf hesaplama: DOM'a dokunmaz, tek başına test edilebilir.
// `scoring` her zaman açıkça verilir (config.js > TESTS[id].scoring), varsayılan yoktur.

export function computeScore(answers, scoring) {
  return answers.reduce((sum, a, i) => sum + a * (scoring.weights[i] ?? 1), 0);
}

// En yüksek alınabilecek skor: her madde için (en yüksek cevap değeri = scaleSize - 1) × ağırlık
export function maxScore(scoring, scaleSize) {
  return scoring.weights.reduce((sum, w) => sum + w * (scaleSize - 1), 0);
}

// Döndürdüğü anahtar, dil dosyasında tests.<id>.messages.<anahtar> olarak bulunmalıdır.
//   bands varsa : skor >= min olan son bandın key'i (bands artan min sırasında olmalı), hiçbiri yoksa "neutral"
//   yoksa       : "suspect" | "unlikely", threshold null iken "neutral"
export function classify(score, scoring) {
  if (Array.isArray(scoring.bands)) {
    let key = "neutral";
    for (const band of scoring.bands) {
      if (score >= band.min) key = band.key;
    }
    return key;
  }
  if (scoring.threshold == null) return "neutral";
  return score >= scoring.threshold ? "suspect" : "unlikely";
}
