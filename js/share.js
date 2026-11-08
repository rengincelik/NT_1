// WhatsApp paylaşım linkleri. Sadece site linki paylaşılır, cevaplar asla.
// Link ?lang= taşır: Türkçe seçiliyken paylaşılan link karşı tarafta Türkçe açılır.
import { t, getLang, onLangChange } from "./i18n.js";

function update() {
  const url = new URL(location.href);
  url.hash = "";
  url.search = "";
  url.searchParams.set("lang", getLang());

  const href = "https://wa.me/?text=" + encodeURIComponent(`${t("share.text")} ${url.href}`);

  document.querySelectorAll("[data-share-whatsapp]").forEach((a) => {
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

export function initShare() {
  update();
  onLangChange(update);
}
