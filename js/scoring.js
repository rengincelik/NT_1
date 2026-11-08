// Saf hesaplama: DOM'a dokunmaz, tek başına test edilebilir.
import { SCORING } from "./config.js";

export function computeScore(answers, scoring = SCORING) {
  return answers.reduce((sum, a, i) => sum + a * (scoring.weights[i] ?? 1), 0);
}

// "suspect" | "unlikely" | "neutral"
export function classify(score, scoring = SCORING) {
  if (scoring.threshold == null) return "neutral";
  return score >= scoring.threshold ? "suspect" : "unlikely";
}
