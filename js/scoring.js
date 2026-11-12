// Saf hesaplama: DOM'a dokunmaz, tek başına test edilebilir.
// `scoring` her zaman açıkça verilir (config.js > TESTS[id].scoring), varsayılan yoktur.

// Geçerli cevap seti: tam `questionCount` madde, hepsi 0..scaleSize-1 arasında sayı.
// ESS kuralı (Mapi, Scaling and Scoring v2.0): tek bir madde bile eksikse anket geçersizdir,
// eksik madde tahmin edilerek (interpolasyon) doldurulamaz.
export function isValid(answers, scoring, scaleSize) {
  return (
    Array.isArray(answers) &&
    answers.length === scoring.weights.length &&
    answers.every((a) => Number.isFinite(a) && a >= 0 && a <= scaleSize - 1)
  );
}

// Skor = Σ (cevap + answerOffset) × ağırlık + constant
//   answerOffset: arayüz cevapları 0'dan başlar; ölçek 1'den başlıyorsa (SNS: 1–5) 1 verilir. Varsayılan 0.
//   constant    : formüldeki sabit terim (SNS: +20). Varsayılan 0.
// ESS'te ağırlık 1, offset/constant yok: skor madde puanlarının toplamıdır (0–24).
// Yarım puanlı toplam (ör. 1½ cevabı) bir sonraki tam sayıya yukarı yuvarlanır (ESS kuralı).
// Arayüz yalnızca tam sayı cevap ürettiği için bu pratikte etkisizdir, kurala uyum içindir.
export function computeScore(answers, scoring) {
  const offset = scoring.answerOffset ?? 0;
  const sum = answers.reduce((s, a, i) => s + (a + offset) * (scoring.weights[i] ?? 1), 0);
  return Math.ceil(sum + (scoring.constant ?? 0));
}

// Alınabilecek en yüksek / en düşük skor (negatif ağırlıklar için doğru uçlar seçilir)
function extreme(scoring, scaleSize, pick) {
  const offset = scoring.answerOffset ?? 0;
  const lo = offset;
  const hi = scaleSize - 1 + offset;
  const sum = scoring.weights.reduce((s, w) => s + pick(w * lo, w * hi), 0);
  return sum + (scoring.constant ?? 0);
}
export const maxScore = (scoring, scaleSize) => extreme(scoring, scaleSize, Math.max);
export const minScore = (scoring, scaleSize) => extreme(scoring, scaleSize, Math.min);

// Döndürdüğü anahtar, dil dosyasında tests.<id>.messages.<anahtar> olarak bulunmalıdır.
//   bands varsa : skor >= min olan son bandın key'i (bands artan min sırasında olmalı), hiçbiri yoksa "neutral"
//   yoksa       : "suspect" | "unlikely", threshold null iken "neutral"
//                 suspectBelow: true ise skor < threshold şüpheli (SNS: skor < 0 = narkolepsi);
//                 değilse skor >= threshold şüpheli
export function classify(score, scoring) {
  if (Array.isArray(scoring.bands)) {
    let key = "neutral";
    for (const band of scoring.bands) {
      if (score >= band.min) key = band.key;
    }
    return key;
  }
  if (scoring.threshold == null) return "neutral";
  const suspect = scoring.suspectBelow ? score < scoring.threshold : score >= scoring.threshold;
  return suspect ? "suspect" : "unlikely";
}
