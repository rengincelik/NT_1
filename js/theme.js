// Tema: açık / koyu.
// Öncelik: kullanıcının butonla yaptığı seçim (localStorage) > tarayıcı/sistem ayarı (prefers-color-scheme).
// Seçim yapılmadıysa <html>'de data-theme yoktur, renkleri base.css'teki media query belirler;
// sistem teması değişirse sayfa da canlı olarak değişir.
import { t, onLangChange } from "./i18n.js";

const STORAGE_KEY = "theme";
const root = document.documentElement;
const mq = window.matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set();

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

function store(value) {
  try { localStorage.setItem(STORAGE_KEY, value); } catch { /* özel pencere vb. */ }
}

let chosen = readStored(); // "dark" | "light" | null (= sistemi izle)

export const getTheme = () => chosen ?? (mq.matches ? "dark" : "light");
export const onThemeChange = (fn) => { listeners.add(fn); };

function apply() {
  if (chosen) root.dataset.theme = chosen;
  else delete root.dataset.theme;
}

export function initTheme() {
  const btn = document.getElementById("theme-btn");

  const sync = () => {
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(getTheme() === "dark"));
  };
  const label = () => {
    if (btn) btn.title = t("theme.toggle");
  };
  const notify = () => listeners.forEach((fn) => fn(getTheme()));

  apply();
  sync();
  label();

  if (btn) {
    btn.hidden = false;
    btn.addEventListener("click", () => {
      chosen = getTheme() === "dark" ? "light" : "dark";
      store(chosen);
      apply();
      sync();
      notify();
    });
  }

  // Kullanıcı seçim yapmadıysa sistem teması değişince butonu ve dinleyicileri güncelle
  mq.addEventListener("change", () => {
    if (chosen) return;
    sync();
    notify();
  });

  onLangChange(label);
}
