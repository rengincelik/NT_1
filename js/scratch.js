// Kazı-kazan: kapağı canvas'a çizer, parmak/fare ile silinir, yeterince silinince tamamen açılır.
export function createScratch({ canvas, onReveal, getLabel = () => "", threshold = 0.5, brush = 36 }) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let touched = false; // kullanıcı silmeye başladı mı (başladıysa dil değişince kapak yeniden çizilmez)
  let drawing = false;
  let revealed = false;
  let last = null;
  let lastCheck = 0;

  function paintCover() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    const root = getComputedStyle(document.documentElement);
    const a = root.getPropertyValue("--scratch-a").trim() || "#c9d6e8";
    const b = root.getPropertyValue("--scratch-b").trim() || "#e2d3e0";
    const ink = root.getPropertyValue("--scratch-ink").trim() || "#5d6b85";

    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, a);
    grad.addColorStop(1, b);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // hafif parıltılar
    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 36; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * rect.width, Math.random() * rect.height, 1 + Math.random() * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // yönlendirme yazısı
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = ink;
    ctx.font = `600 18px ${getComputedStyle(canvas).fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getLabel(), rect.width / 2, rect.height / 2);
    ctx.globalAlpha = 1;
  }

  function point(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function stroke(from, to) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = brush;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  function clearedRatio() {
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let total = 0;
    let clear = 0;
    for (let i = 3; i < data.length; i += 64) { // her 16. piksel
      total++;
      if (data[i] < 128) clear++;
    }
    return total ? clear / total : 0;
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    canvas.classList.add("revealed");
    onReveal?.();
  }

  function check() {
    if (!revealed && clearedRatio() >= threshold) reveal();
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (revealed) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drawing = true;
    touched = true;
    canvas.setPointerCapture(e.pointerId);
    last = point(e);
    stroke(last, last);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const p = point(e);
    stroke(last, p);
    last = p;
    const now = performance.now();
    if (now - lastCheck > 250) {
      lastCheck = now;
      check();
    }
  });

  const end = () => {
    if (!drawing) return;
    drawing = false;
    check();
  };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!revealed && !drawing) paintCover();
    }, 150);
  });

  return {
    reset() {
      revealed = false;
      drawing = false;
      touched = false;
      canvas.classList.remove("revealed");
      paintCover();
    },
    revealNow: reveal,
    // dil değişince kapak yazısını yenile (silinmeye başlandıysa dokunma)
    relabel() {
      if (!revealed && !touched) paintCover();
    },
  };
}
