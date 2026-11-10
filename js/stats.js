// Sayaç: görüntülenme ve tamamlanan test sayısı.
//
// Gösterilen sayılar ve asıl sayım: kendi Worker'ımız (worker/ klasörü). STATS.workerUrl boşsa kutu görünmez.
// GoatCounter (isteğe bağlı, arka planda): STATS.goatcounterCode doluysa sadece sayım gönderilir, sayılar buradan OKUNMAZ.
//
// Ne gönderilir: sayfa açılışı ve test bitişi olayı. Cevaplar, skor, dil, referrer gönderilmez.
import { STATS } from "./config.js";
import { t, onLangChange } from "./i18n.js";

const workerUrl = (STATS.workerUrl || "").trim().replace(/\/+$/, "");
const gcCode = (STATS.goatcounterCode || "").trim();
const gcBase = `https://${gcCode}.goatcounter.com`;

// Footer'daki "anonim sayılır" notu için: herhangi bir sayım açıksa true
export const statsEnabled = Boolean(workerUrl || gcCode);

let counts = null;
let completedSent = false;

// Geliştirme ortamı, DNT/GPC açık ziyaretçi ve kendi tarayıcın (localStorage.skipgc) sayılmaz.
function shouldTrack() {
  if (["", "localhost", "127.0.0.1", "[::1]"].includes(location.hostname)) return false;
  if (navigator.doNotTrack === "1" || navigator.globalPrivacyControl) return false;
  try {
    if (localStorage.getItem("skipgc")) return false;
  } catch { /* özel pencere vb. */ }
  return true;
}

// --- GoatCounter (sadece sayım, arka planda) ---
function gcHit(path) {
  if (!gcCode || !shouldTrack()) return;
  const params = new URLSearchParams({ p: path, rnd: String(Math.random()).slice(2) });
  new Image().src = `${gcBase}/count?${params}`; // 1x1 GIF döner, yanıt okunmaz
}

// --- Worker ---
// GET = sadece oku, POST = bir artır ve güncel sayıları al
async function callWorker(method, path) {
  const res = await fetch(`${workerUrl}${path}`, {
    method,
    cache: "no-store",
    keepalive: method === "POST",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const views = Number(data.views);
  const tests = Number(data.tests);
  if (!Number.isFinite(views) || !Number.isFinite(tests)) throw new Error("beklenmeyen yanıt");
  return { views, tests };
}

function render() {
  const box = document.getElementById("stats");
  if (!box || !counts) return;
  // İkisi de 0 ise (yeni kurulum) kutuyu gösterme
  if (counts.views === 0 && counts.tests === 0) return;
  const fmt = new Intl.NumberFormat(t("meta.dateLocale"));
  document.getElementById("stat-views").textContent = fmt.format(counts.views);
  document.getElementById("stat-tests").textContent = fmt.format(counts.tests);
  box.hidden = false;
}

export async function initStats() {
  if (!statsEnabled) return;

  gcHit(STATS.paths.view);
  if (!workerUrl) return;

  onLangChange(render);

  try {
    // Sayılan ziyarette tek istek hem artırır hem sayıları getirir. Sayılmayan ziyarette (localhost, DNT, skipgc) sadece okunur.
    counts = shouldTrack()
      ? await callWorker("POST", "/tally/view")
      : await callWorker("GET", "/tally");
    render();
  } catch (err) {
    console.warn("İstatistikler alınamadı, kutu gizli kalıyor:", err.message);
  }
}

// Sayfa yüklemesi başına en fazla bir kez sayılır (cevapları düzenleyip yeniden bitirmek tekrar saymaz)
export function trackTestCompleted() {
  if (completedSent) return;
  completedSent = true;

  gcHit(STATS.paths.testDone);

  if (workerUrl && shouldTrack()) {
    callWorker("POST", "/tally/test")
      .then((c) => { counts = c; render(); })
      .catch((err) => console.warn("Test sayısı gönderilemedi:", err.message));
  }
}
