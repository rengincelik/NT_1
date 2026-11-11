// Test seçici: TESTS içindeki her test için bir buton üretir (mevcut .btn / .btn-ghost sınıfları, yeni CSS gerekmez).
// Tek test varsa kutu gizli kalır. Etiketler tests.<id>.name'den gelir, dil değişince yeniden yazılır.
import { t, onLangChange } from "./i18n.js";

export function initTestSwitch({ container, ids, current, onSelect }) {
  if (!container) return { set() {} };

  let active = current;
  const buttons = new Map();

  for (const id of ids) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.addEventListener("click", () => {
      if (id === active) return;
      set(id);
      onSelect(id);
    });
    container.appendChild(btn);
    buttons.set(id, btn);
  }

  function paint() {
    for (const [id, btn] of buttons) {
      const on = id === active;
      btn.textContent = t(`tests.${id}.name`);
      btn.setAttribute("aria-pressed", String(on));
      btn.className = on ? "btn" : "btn btn-ghost";
    }
  }

  function set(id) {
    active = id;
    paint();
  }

  container.hidden = ids.length < 2;
  onLangChange(paint);
  paint();

  return { set };
}
