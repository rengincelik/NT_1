// Çalıştır: node --test scoring.test.js
// ESS kuralları: Mapi Research Trust, "ESS Scaling and Scoring v2.0" (Ağustos 2017).
import test from "node:test";
import assert from "node:assert/strict";
import { computeScore, maxScore, minScore, classify, isValid } from "./scoring.js";

// config.js > TESTS.ess ile aynı olmalı
const ESS = {
  weights: [1, 1, 1, 1, 1, 1, 1, 1],
  bands: [
    { min: 0, key: "lowerNormal" },
    { min: 6, key: "higherNormal" },
    { min: 11, key: "mild" },
    { min: 13, key: "moderate" },
    { min: 16, key: "severe" },
  ],
};
const fill = (v) => Array(8).fill(v);

test("skor aralığı 0–24", () => {
  assert.equal(computeScore(fill(0), ESS), 0);
  assert.equal(computeScore(fill(3), ESS), 24);
  assert.equal(maxScore(ESS, 4), 24);
});

test("skor madde puanlarının toplamıdır (ağırlık yok)", () => {
  assert.equal(computeScore([3, 2, 1, 0, 3, 2, 1, 0], ESS), 12);
});

test("yarım puanlı toplam yukarı yuvarlanır", () => {
  assert.equal(computeScore([1.5, 0, 0, 0, 0, 0, 0, 0], ESS), 2);
  assert.equal(computeScore([1.5, 1.5, 0, 0, 0, 0, 0, 0], ESS), 3);
});

test("bant sınırları: 0-5 / 6-10 / 11-12 / 13-15 / 16-24", () => {
  const cases = [
    [0, "lowerNormal"], [5, "lowerNormal"],
    [6, "higherNormal"], [10, "higherNormal"],
    [11, "mild"], [12, "mild"],
    [13, "moderate"], [15, "moderate"],
    [16, "severe"], [24, "severe"],
  ];
  for (const [score, key] of cases) assert.equal(classify(score, ESS), key, `skor ${score}`);
});

test("geçerlilik: eksik, fazla ya da aralık dışı cevap geçersiz", () => {
  assert.equal(isValid(fill(2), ESS, 4), true);
  assert.equal(isValid([0, 1, 2, 3, 0, 1, 2, null], ESS, 4), false);
  assert.equal(isValid([0, 1, 2, 3, 0, 1, 2], ESS, 4), false);
  assert.equal(isValid(fill(4), ESS, 4), false);
  assert.equal(isValid(fill(-1), ESS, 4), false);
});

// ---- SNS ----
// Sturzenegger 2018 (Clin Transl Neurosci 2:1-5) Tablo 1; Türkçe doğrulama: Demir 2023 (Clin Transl Neurosci 7:16)
// Skor = 6×Q1 + 9×Q2 − 5×Q3 − 11×Q4 − 13×Q5 + 20, cevaplar 1–5; skor < 0 narkolepsi (NT1) şüphesi.
// Arayüz cevapları 0–4 verir, bu yüzden answerOffset: 1.
// config.js > TESTS.sns.scoring ile aynı olmalı
const SNS = {
  weights: [6, 9, -5, -11, -13],
  constant: 20,
  answerOffset: 1,
  threshold: 0,
  suspectBelow: true,
};

test("SNS: formül makaledeki 1–5 kodlamasıyla aynı sonucu verir", () => {
  // hepsi "hiç" (1): 6+9−5−11−13+20 = 6
  assert.equal(computeScore([0, 0, 0, 0, 0], SNS), 6);
  // hepsi "neredeyse hep" (5): 30+45−25−55−65+20 = −50
  assert.equal(computeScore([4, 4, 4, 4, 4], SNS), -50);
  // Q1=5,Q2=5,Q3=1,Q4=1,Q5=1: 30+45−5−11−13+20 = 66 (olası en yüksek)
  assert.equal(computeScore([4, 4, 0, 0, 0], SNS), 66);
  // Q1=1,Q2=1,Q3=5,Q4=5,Q5=5: 6+9−25−55−65+20 = −110 (olası en düşük)
  assert.equal(computeScore([0, 0, 4, 4, 4], SNS), -110);
});

test("SNS: uç değerler", () => {
  assert.equal(maxScore(SNS, 5), 66);
  assert.equal(minScore(SNS, 5), -110);
});

test("SNS: eşik < 0 şüpheli, 0 ve üstü değil", () => {
  assert.equal(classify(-1, SNS), "suspect");
  assert.equal(classify(0, SNS), "unlikely");
  assert.equal(classify(1, SNS), "unlikely");
  // tam 0 veren cevap seti: 1-5 kodlamasında [2,2,3,2,1]
  assert.equal(computeScore([1, 1, 2, 1, 0], SNS), 0);
});

test("SNS: tek başına katapleksi maddesi (Q4 ya da Q5 = 5) şüpheli çıkar", () => {
  assert.equal(classify(computeScore([0, 0, 0, 4, 0], SNS), SNS), "suspect"); // −38
  assert.equal(classify(computeScore([0, 0, 0, 0, 4], SNS), SNS), "suspect"); // −46
});

test("SNS: geçerlilik 5 madde ister", () => {
  assert.equal(isValid([0, 1, 2, 3, 4], SNS, 5), true);
  assert.equal(isValid([0, 1, 2, 3], SNS, 5), false);
  assert.equal(isValid([0, 1, 2, 3, 5], SNS, 5), false);
});
