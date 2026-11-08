// Header'daki bayrak butonları. Liste languages.js'ten gelir, switch/dropdown yok.
import { LANGUAGES } from "./languages.js";
import { getLang, setLang, onLangChange } from "./i18n.js";

export function initLangSwitch() {
  const box = document.getElementById("lang-list");
  if (!box) return;

  const buttons = LANGUAGES.map(({ code, name, flag }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lang-btn";
    b.dataset.lang = code;
    b.lang = code;
    b.title = name;
    b.setAttribute("aria-label", name);

    const img = document.createElement("img");
    img.src = flag;
    img.alt = "";
    img.width = 28;
    img.height = 28;
    img.draggable = false;

    b.appendChild(img);
    b.addEventListener("click", () => setLang(code));
    return b;
  });

  box.replaceChildren(...buttons);

  const mark = () => {
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === getLang())));
  };
  mark();
  onLangChange(mark);
}
