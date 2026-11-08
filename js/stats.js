// İstatistikler (GoatCounter): görüntülenme ve tamamlanan test sayısı.
// STATS.goatcounterCode boşsa tamamen kapalı: hiçbir istek atılmaz, kutu görünmez.
//
// Ne gönderilir: sadece iki sayfa yolu ("/" ve "/test-completed"). Cevaplar, skor, dil gönderilmez.
// Test tamamlanması, GoatCounter'da sanal bir sayfa görüntülemesi olarak sayılır.
import { STATS } from "./config.js";
import { t, onLangChange } from "./i18n.js";

const code = (STATS.goatcounterCode || "").trim();
const base = `https://${code}.goatcounter.com`;

export const statsEnabled = Boolean(code);

let counts = null;
let completedSent = false;

// Geliştirme ortamı, DNT/GPC açık ziyaretçi ve kendi tarayıcın (localStorage.skipgc) sayılmaz.
function shouldTrack() {
  if (!statsEnabled) return false;
  if (["", "localhost", "127.0.0.1", "[::1]"].includes(location.hostname)) return false;
  if (navigator.doNotTrack === "1" || navigator.globalPrivacyControl) return false;
  try {
    if (localStorage.getItem("skipgc")) return false;
  } catch { /* özel pencere vb. */ }
  return true;
}

function hit(path) {
  if (!shouldTrack()) return;
  const params = new URLSearchParams({ p: path, rnd: String(Math.random()).slice(2) });
  new Image().src = `${base}/count?${params}`; // 1x1 GIF döner, yanıt okunmaz
}

// Herkese açık sayaç. Yanıtta count binlik ayraçlı bir string ("1 234"). Bilinmeyen yol için 404 = 0.
async function fetchCount(path) {
  const res = await fetch(`${base}/counter/${encodeURIComponent(path)}.json`);
  if (res.status === 404) return 0;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const n = parseInt(String(data.count).replace(/\D/g, ""), 10);
  if (!Number.isFinite(n)) throw new Error("beklenmeyen yanıt");
  return n;
}

function render() {
  const box = document.getElementById("stats");
  if (!box || !counts) return;
  const fmt = new Intl.NumberFormat(t("meta.dateLocale"));
  document.getElementById("stat-views").textContent = fmt.format(counts.views);
  document.getElementById("stat-tests").textContent = fmt.format(counts.tests);
  box.hidden = false;
}

export async function initStats() {
  if (!statsEnabled) return;

  hit(STATS.paths.view);
  onLangChange(render);

  try {
    const [views, tests] = await Promise.all([
      fetchCount(STATS.paths.view),
      fetchCount(STATS.paths.testDone),
    ]);
    // İkisi de 0 ise (yeni site ya da yanlış ayar) kutuyu gösterme
    if (views === 0 && tests === 0) return;
    counts = { views, tests };
    render();
  } catch (err) {
    console.warn("İstatistikler alınamadı, kutu gizli kalıyor:", err.message);
  }
}

// Sayfa yüklemesi başına en fazla bir kez sayılır (cevapları düzenleyip yeniden bitirmek tekrar saymaz)
export function trackTestCompleted() {
  if (completedSent) return;
  completedSent = true;
  hit(STATS.paths.testDone);
}
