// Sonuç paneli: mesajı hazırlar, kazı-kazanı yönetir, yazdırma özetini üretir.
// Hangi testin sonucu gösterildiğini show(answers, testId) ile öğrenir; metinler tests.<id>.* altından gelir.
// Dil değişince mesaj, özet ve kapak yazısı yeni dille yeniden çizilir.
import { TESTS } from "./config.js";
import { classify, computeScore, maxScore } from "./scoring.js";
import { t, onLangChange } from "./i18n.js";
import { createScratch } from "./scratch.js";

export function createResult({
  panel, content, canvas, hint, skipBtn, actions, summary,
  editBtn, restartBtn, printBtn, onEdit, onRestart,
}) {
  const scratch = createScratch({
    canvas,
    onReveal: revealed,
    getLabel: () => t("result.cover"),
  });
  let answers = null;
  let testId = null;

  // İsteğe bağlı metin: dil dosyasında yoksa t() anahtarın kendisini döndürür
  function optional(key) {
    const v = t(key);
    return v === key ? null : v;
  }

  function scoreLine() {
    const def = TESTS[testId];
    if (!def.showScore) return null;
    return t("result.score", {
      score: computeScore(answers, def.scoring),
      max: maxScore(def.scoring, def.scaleSize),
    });
  }

  function revealed() {
    hint.hidden = true;
    skipBtn.parentElement.hidden = true;
    actions.hidden = false;
  }

  function renderMessage() {
    const { scoring } = TESTS[testId];
    const kind = classify(computeScore(answers, scoring), scoring);
    const h = document.createElement("h3");
    h.textContent = t(`tests.${testId}.messages.${kind}.title`);
    const p = document.createElement("p");
    p.textContent = t(`tests.${testId}.messages.${kind}.body`);
    const score = scoreLine();
    if (score) {
      const sp = document.createElement("p");
      sp.className = "result-score";
      sp.textContent = score;
      content.replaceChildren(h, sp, p);
    } else {
      content.replaceChildren(h, p);
    }
  }

  function renderSummary() {
    const h = document.createElement("h3");
    h.textContent = t(`tests.${testId}.print.title`);

    const date = document.createElement("p");
    date.textContent = new Date().toLocaleDateString(t("meta.dateLocale"));

    const parts = [h, date];

    const score = scoreLine();
    if (score) {
      const { scoring } = TESTS[testId];
      const kind = classify(computeScore(answers, scoring), scoring);
      const sp = document.createElement("p");
      sp.textContent = `${score} (${t(`tests.${testId}.messages.${kind}.title`)})`;
      parts.push(sp);
    }

    const ol = document.createElement("ol");
    answers.forEach((a, i) => {
      const li = document.createElement("li");
      li.textContent = `${t(`tests.${testId}.questions.${i}`)} — ${t(`tests.${testId}.scale.${a}`)}`;
      ol.appendChild(li);
    });

    const note = document.createElement("p");
    note.textContent = t(`tests.${testId}.print.note`);

    parts.push(ol, note);

    const copyright = optional(`tests.${testId}.copyright`);
    if (copyright) {
      const cp = document.createElement("p");
      cp.textContent = copyright;
      parts.push(cp);
    }

    summary.replaceChildren(...parts);
  }

  function render() {
    if (!answers) return;
    renderMessage();
    renderSummary();
    scratch.relabel();
  }

  // opts.revealed: daha önce bitirilmiş testin sonucunu tekrar gösterirken kazı-kazanı atla
  function show(a, id, { revealed: alreadyRevealed = false } = {}) {
    answers = a;
    testId = id;
    renderMessage();
    renderSummary();

    hint.hidden = false;
    skipBtn.parentElement.hidden = false;
    actions.hidden = true;
    panel.hidden = false;

    // panel görünür olduktan sonra ölçüp kapağı çiz
    requestAnimationFrame(() => {
      scratch.reset();
      if (alreadyRevealed) scratch.revealNow();
    });
  }

  function hide() {
    panel.hidden = true;
  }

  skipBtn.addEventListener("click", () => scratch.revealNow());
  editBtn.addEventListener("click", () => onEdit());
  restartBtn.addEventListener("click", () => onRestart());
  printBtn.addEventListener("click", () => window.print());
  onLangChange(render);

  return { show, hide };
}
