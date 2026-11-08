// DOM işleri: render, cevap okuma, sonuç gösterme.
import { QUESTIONS, SCALE, MESSAGES } from "./config.js";

const $ = (sel) => document.querySelector(sel);

export function renderQuiz() {
  const form = $("#quiz");
  form.innerHTML = "";

  QUESTIONS.forEach((text, i) => {
    const fs = document.createElement("fieldset");
    fs.className = "question";
    fs.dataset.index = i;

    const legend = document.createElement("legend");
    legend.textContent = `${i + 1}. ${text}`;
    fs.appendChild(legend);

    const scale = document.createElement("div");
    scale.className = "scale";
    for (let v = SCALE.min; v <= SCALE.max; v++) {
      const id = `q${i}-${v}`;
      const input = Object.assign(document.createElement("input"), {
        type: "radio", name: `q${i}`, id, value: v,
      });
      const label = Object.assign(document.createElement("label"), {
        htmlFor: id, textContent: v,
      });
      scale.append(input, label);
    }
    fs.appendChild(scale);

    const legendRow = document.createElement("div");
    legendRow.className = "scale-legend";
    legendRow.innerHTML = `<span></span><span></span>`;
    legendRow.children[0].textContent = `${SCALE.min}: ${SCALE.minLabel}`;
    legendRow.children[1].textContent = `${SCALE.max}: ${SCALE.maxLabel}`;
    fs.appendChild(legendRow);

    form.appendChild(fs);
  });
}

// Eksik soru varsa null döner ve eksikleri işaretler.
export function readAnswers() {
  const answers = [];
  let missing = false;

  QUESTIONS.forEach((_, i) => {
    const checked = document.querySelector(`input[name="q${i}"]:checked`);
    const fs = document.querySelector(`.question[data-index="${i}"]`);
    fs.classList.toggle("invalid", !checked);
    if (checked) answers.push(Number(checked.value));
    else missing = true;
  });

  return missing ? null : answers;
}

export function showError(message) {
  const el = $("#quiz-error");
  el.textContent = message || "";
  el.hidden = !message;
}

export function showResult(kind) {
  const { title, body } = MESSAGES[kind];
  const box = $("#result");
  box.innerHTML = "";
  const h = document.createElement("h3");
  h.textContent = title;
  const p = document.createElement("p");
  p.textContent = body;
  box.append(h, p);
  box.hidden = false;
  $("#reset-btn").hidden = false;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

export function resetUI() {
  renderQuiz();
  showError("");
  $("#result").hidden = true;
  $("#reset-btn").hidden = true;
}
