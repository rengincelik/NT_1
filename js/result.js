// Sonuç paneli: mesajı hazırlar, kazı-kazanı yönetir, yazdırma özetini üretir.
// Dil değişince mesaj, özet ve kapak yazısı yeni dille yeniden çizilir.
import { classify, computeScore } from "./scoring.js";
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

  function revealed() {
    hint.hidden = true;
    skipBtn.parentElement.hidden = true;
    actions.hidden = false;
  }

  function renderMessage() {
    const kind = classify(computeScore(answers));
    const h = document.createElement("h3");
    h.textContent = t(`messages.${kind}.title`);
    const p = document.createElement("p");
    p.textContent = t(`messages.${kind}.body`);
    content.replaceChildren(h, p);
  }

  function renderSummary() {
    const h = document.createElement("h3");
    h.textContent = t("print.title");

    const date = document.createElement("p");
    date.textContent = new Date().toLocaleDateString(t("meta.dateLocale"));

    const ol = document.createElement("ol");
    answers.forEach((a, i) => {
      const li = document.createElement("li");
      li.textContent = `${t(`questions.${i}`)} — ${t(`scale.${a}`)}`;
      ol.appendChild(li);
    });

    const note = document.createElement("p");
    note.textContent = t("print.note");

    summary.replaceChildren(h, date, ol, note);
  }

  function render() {
    if (!answers) return;
    renderMessage();
    renderSummary();
    scratch.relabel();
  }

  function show(a) {
    answers = a;
    renderMessage();
    renderSummary();

    hint.hidden = false;
    skipBtn.parentElement.hidden = false;
    actions.hidden = true;
    panel.hidden = false;

    // panel görünür olduktan sonra ölçüp kapağı çiz
    requestAnimationFrame(() => scratch.reset());
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
