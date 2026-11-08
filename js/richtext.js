// Kaynak (alıntı) destekli metin.
//   [@anahtar]  → üst simge numara (sayfa içi link). Numara, kutu içindeki ilk geçiş sırasına göre verilir.
//   "## Başlık" → (sadece liste modunda) h3 başlık
// Kaynak listesi kutunun altındaki [data-refs] alanına yazılır. Her kutu (data-rich-block) kendi numaralarını tutar.
//
// HTML:
//   [data-rich-block="id"]          kutu (scroll-box)
//     [data-i18n-rich="anahtar"]    tek metin (dil dosyasında string)
//     [data-i18n-rich-list="anahtar"]  paragraf listesi (dil dosyasında dizi)
//     [data-refs]                   kaynak listesi alanı
import { REFERENCES } from "./references.js";
import { t, get, onLangChange } from "./i18n.js";

const TOKEN = /\[@([\w-]+)\]/g;
const SAFE_URL = /^https?:\/\//i;

function appendRich(el, text, cited, blockId) {
  let last = 0;
  for (const m of String(text).matchAll(TOKEN)) {
    if (m.index > last) el.append(text.slice(last, m.index));

    const key = m[1];
    if (!REFERENCES[key]) {
      console.warn(`Tanımsız kaynak: ${key} (js/references.js içine ekle)`);
      el.append(m[0]);
    } else {
      if (!cited.has(key)) cited.set(key, cited.size + 1);
      const n = cited.get(key);

      const sup = document.createElement("sup");
      const a = document.createElement("a");
      a.className = "cite";
      a.href = `#ref-${blockId}-${n}`;
      a.textContent = String(n);
      a.setAttribute("aria-label", t("refs.cite", { n }));
      sup.appendChild(a);
      el.appendChild(sup);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) el.append(text.slice(last));
}

function renderRefs(block, blockId, cited) {
  const box = block.querySelector("[data-refs]");
  if (!box) return;

  if (!cited.size) {
    box.replaceChildren();
    box.hidden = true;
    return;
  }

  const title = document.createElement("h3");
  title.className = "refs-title";
  title.textContent = t("refs.title");

  const ol = document.createElement("ol");
  let n = 0;
  for (const key of cited.keys()) {
    n += 1; // Map ekleme sırasını korur, numara = sıra
    const ref = REFERENCES[key];
    const li = document.createElement("li");
    li.id = `ref-${blockId}-${n}`;

    if (ref.url && SAFE_URL.test(ref.url)) {
      const a = document.createElement("a");
      a.href = ref.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = ref.text;
      li.appendChild(a);
    } else {
      li.textContent = ref.text;
    }
    ol.appendChild(li);
  }

  box.replaceChildren(title, ol);
  box.hidden = false;
}

function renderBlock(block) {
  const blockId = block.dataset.richBlock;
  const cited = new Map();

  // Tek geçişte DOM sırasıyla: numaralar metindeki görünüş sırasına uysun
  block.querySelectorAll("[data-i18n-rich], [data-i18n-rich-list]").forEach((el) => {
    if (el.dataset.i18nRich) {
      el.replaceChildren();
      appendRich(el, t(el.dataset.i18nRich), cited, blockId);
      return;
    }

    const items = get(el.dataset.i18nRichList);
    const nodes = (Array.isArray(items) ? items : []).map((item) => {
      const isHeading = /^##\s+/.test(item);
      const node = document.createElement(isHeading ? "h3" : "p");
      appendRich(node, isHeading ? item.replace(/^##\s+/, "") : item, cited, blockId);
      return node;
    });
    el.replaceChildren(...nodes);
  });

  renderRefs(block, blockId, cited);
}

// Numaraya tıklayınca sayfa adresi değişmeden kutu içinde kaynağa kaydırır
function onCiteClick(e) {
  const a = e.target.closest("a.cite");
  if (!a) return;
  e.preventDefault();

  const target = document.getElementById(a.hash.slice(1));
  if (!target) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  target.classList.add("flash");
  setTimeout(() => target.classList.remove("flash"), 1600);
}

export function initRichText() {
  const blocks = [...document.querySelectorAll("[data-rich-block]")];
  blocks.forEach((b) => b.addEventListener("click", onCiteClick));

  const renderAll = () => blocks.forEach(renderBlock);
  renderAll();
  onLangChange(renderAll);
}
