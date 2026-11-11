// Çeviri motoru: dil yükleme, t(), sayfadaki data-i18n alanlarını doldurma, dil değişince bildirim.
import { LANGUAGES, DEFAULT_LANG } from "./languages.js";

const STORAGE_KEY = "lang";
const cache = new Map();
const listeners = new Set();
let fallback = null;
let dict = null;
let current = DEFAULT_LANG;
let seq = 0;

const find = (code) => LANGUAGES.find((l) => l.code === code);

async function load(code) {
  if (!cache.has(code)) {
    const mod = await find(code).load();
    cache.set(code, mod.default);
  }
  return cache.get(code);
}

const lookup = (obj, path) =>
  path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

export function get(path) {
  const v = lookup(dict, path);
  return v !== undefined ? v : lookup(fallback, path);
}

export function t(path, vars = {}) {
  const v = get(path);
  if (typeof v !== "string") return path;
  return v.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

export const getLang = () => current;
export const onLangChange = (fn) => { listeners.add(fn); };

function applyStatic() {
  document.documentElement.lang = current;
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  });
}

function readStored() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function store(code) {
  try { localStorage.setItem(STORAGE_KEY, code); } catch { /* özel pencere vb. */ }
}

// Tarayıcı dil tercihleri (navigator.languages, sıralı). "tr-TR" → "tr".
// Kayıtlı dillerden ilk eşleşen döner, hiçbiri yoksa null.
function fromBrowser() {
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    const base = String(tag ?? "").toLowerCase().split("-")[0];
    if (find(base)) return base;
  }
  return null;
}

export async function setLang(code, { persist = true } = {}) {
  if (!find(code)) code = DEFAULT_LANG;
  const mine = ++seq;
  let next;
  try {
    next = await load(code);
  } catch (err) {
    console.error(`Dil yüklenemedi: ${code}`, err);
    return;
  }
  if (mine !== seq) return; // arada başka bir dil seçildi
  dict = next;
  current = code;
  applyStatic();
  if (persist) store(code);
  listeners.forEach((fn) => fn(code));
}

// Öncelik: ?lang= (paylaşılan link) > önceki seçim (bayrağa tıklama) > tarayıcı dili > varsayılan dil.
// Açılışta hiçbir şey kaydedilmez (persist: false); yalnızca kullanıcı bayrağa tıklayınca yazılır.
export async function initI18n() {
  fallback = await load(DEFAULT_LANG);
  const fromUrl = new URLSearchParams(location.search).get("lang");
  const wanted = [fromUrl, readStored()].find((c) => c && find(c)) ?? fromBrowser() ?? DEFAULT_LANG;
  await setLang(wanted, { persist: false });
}
