// Adım adım test: tek soru ekranı, iki yöne gezinme (buton, ok tuşları, kaydırma), 1-5 tuşları.
// Soru ve etiket metinleri i18n'den gelir; dil değişince yerinde güncellenir, cevaplar korunur.
import { t, onLangChange } from "./i18n.js";

export function createQuiz({
  root, track, viewport, prevBtn, nextBtn,
  progressText, progressFill, progressBar,
  count, scaleSize, onFinish,
}) {
  const last = count - 1;
  const answers = new Array(count).fill(null);
  const slides = [];
  const questionEls = [];
  const optionTextEls = []; // [soru][değer]
  let index = 0;
  let autoAdvance = false; // sadece fare/dokunma ve sayı tuşuyla seçince otomatik ilerle

  // --- Render (metinler refreshText'te dolar) ---
  for (let i = 0; i < count; i++) {
    const slide = document.createElement("div");
    slide.className = "slide";

    const q = document.createElement("p");
    q.className = "question-text";
    q.id = `q${i}-label`;

    const group = document.createElement("div");
    group.className = "options";
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-labelledby", q.id);

    const texts = [];
    for (let v = 0; v < scaleSize; v++) {
      const wrap = document.createElement("div");
      wrap.className = "option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      input.id = `q${i}-${v}`;
      input.value = String(v);

      const lab = document.createElement("label");
      lab.htmlFor = input.id;

      const key = document.createElement("span");
      key.className = "opt-key";
      key.textContent = String(v + 1);

      const txt = document.createElement("span");
      texts.push(txt);

      lab.append(key, txt);
      wrap.append(input, lab);
      group.appendChild(wrap);
    }

    slide.append(q, group);
    track.appendChild(slide);
    slides.push(slide);
    questionEls.push(q);
    optionTextEls.push(texts);
  }

  // --- Metin ve durum ---
  function refreshText() {
    for (let i = 0; i < count; i++) {
      questionEls[i].textContent = t(`questions.${i}`);
      for (let v = 0; v < scaleSize; v++) {
        optionTextEls[i][v].textContent = t(`scale.${v}`);
      }
    }
    update();
  }

  function update() {
    progressText.textContent = t("test.progress", { n: index + 1, total: count });
    progressFill.style.width = `${((index + 1) / count) * 100}%`;
    progressBar.setAttribute("aria-valuenow", String(index + 1));
    progressBar.setAttribute("aria-valuemax", String(count));
    prevBtn.disabled = index === 0;
    nextBtn.disabled = answers[index] === null;
    nextBtn.textContent = index === last ? t("test.finish") : t("test.next");
  }

  function focusSlide() {
    const s = slides[index];
    (s.querySelector("input:checked") || s.querySelector("input"))?.focus({ preventScroll: true });
  }

  function go(n) {
    const focusWasInTrack = track.contains(document.activeElement);
    index = Math.max(0, Math.min(last, n));
    track.style.transform = `translateX(${-index * 100}%)`;
    slides.forEach((s, k) => {
      const active = k === index;
      s.inert = !active;
      s.setAttribute("aria-hidden", String(!active));
    });
    update();
    if (focusWasInTrack) focusSlide();
  }

  function next() {
    if (answers[index] === null) return;
    if (index === last) onFinish(answers.slice());
    else go(index + 1);
  }

  function prev() {
    go(index - 1);
  }

  // --- Olaylar ---
  track.addEventListener("pointerdown", () => { autoAdvance = true; });

  track.addEventListener("change", (e) => {
    const input = e.target;
    if (input.type !== "radio") return;
    const i = Number(input.name.slice(1));
    answers[i] = Number(input.value);

    const advance = autoAdvance;
    autoAdvance = false;
    update();

    if (advance && i === index && i < last) {
      setTimeout(() => { if (index === i) go(i + 1); }, 260);
    }
  });

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  root.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      autoAdvance = false; // yön tuşuyla gezerken sıçratma
    } else if (/^[1-9]$/.test(e.key)) {
      const v = Number(e.key) - 1;
      const input = slides[index].querySelector(`input[value="${v}"]`);
      if (!input) return;
      if (input.checked) {
        next();
      } else {
        autoAdvance = true;
        input.click();
        input.focus({ preventScroll: true });
      }
    }
  });

  // Dokunmatik kaydırma
  let startX = 0, startY = 0, tracking = false;

  viewport.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") return;
    tracking = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  viewport.addEventListener("pointerup", (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) next();
      else prev();
    }
  });

  viewport.addEventListener("pointercancel", () => { tracking = false; });

  // --- Dışarıya açılan ---
  function reset() {
    answers.fill(null);
    track.querySelectorAll("input").forEach((i) => { i.checked = false; });
    go(0);
  }

  onLangChange(refreshText);
  refreshText();
  go(0);

  return { goTo: go, reset, lastIndex: last };
}
