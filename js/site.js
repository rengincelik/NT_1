// Footer (yazar bilgileri). İsim ve linkler config.js'ten, açıklama ve not dil dosyasından gelir.
import { AUTHOR } from "./config.js";
import { t, onLangChange } from "./i18n.js";
import { statsEnabled } from "./stats.js";

function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;


  const role = document.createElement("p");
  role.className = "author-role";
  role.textContent = t("footer.role");

  const list = document.createElement("ul");
  list.className = "author-links";
  AUTHOR.links.forEach(({ label, url }) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = url;
    a.textContent = label;
    if (/^https?:/.test(url)) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    li.appendChild(a);
    list.appendChild(li);
  });

  const note = document.createElement("p");
  note.className = "footer-note";
  note.textContent = t("footer.note");

  const parts = [ role, list, note];

  // Sayaç açıksa bunu söylemek zorundayız, kapalıyken söylemek yanlış olur
  if (statsEnabled) {
    const statsNote = document.createElement("p");
    statsNote.className = "footer-note";
    statsNote.textContent = t("footer.statsNote");
    parts.push(statsNote);
  }

  footer.replaceChildren(...parts);
}

export function initSite() {
  renderFooter();
  onLangChange(renderFooter);
}