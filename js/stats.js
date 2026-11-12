// Sayaç: görüntülenme ve tamamlanan test sayısı.
//
// Gösterilen sayılar ve asıl sayım: kendi Worker'ımız (worker/ klasörü). STATS.workerUrl boşsa kutu görünmez.
// GoatCounter (isteğe bağlı, arka planda): STATS.goatcounterCode doluysa sadece sayım gönderilir, sayılar buradan OKUNMAZ.
//
// Ne gönderilir: sayfa açılışı ve test bitişi olayı (hangi test bittiği dahil). Cevaplar, skor, dil, referrer gönderilmez.
// Her test ayrı sayılır: Worker'da test_<id> sayacı, GoatCounter'da /test-completed/<id> yolu.
// Home'daki "tamamlanan test" kutusu tüm testlerin toplamını gösterir.
import { STATS } from "./config.js";
import { t, onLangChange } from "./i18n.js";

const workerUrl = (STATS.workerUrl || "").trim().replace(/\/+$/, "");
const gcCode = (STATS.goatcounterCode || "").trim();
const gcBase = `https://${gcCode}.goatcounter.com`;

// Footer'daki "anonim sayılır" notu için: herhangi bir sayım açıksa true
export const statsEnabled = Boolean(workerUrl || gcCode);

let counts = null;
const completedSent = new Set(); // test id'leri: her test sayfa yüklemesi başına en fazla bir kez sayılır

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
	const tests = Number(data.tests); // tüm testlerin toplamı
	if (!Number.isFinite(views) || !Number.isFinite(tests)) throw new Error("beklenmeyen yanıt");
	return { views, tests, byTest: data.byTest ?? {} };
}

// --- Sayı animasyonu (0'dan değere sayarak yükselir) ---
// shown: ekranda o an yazan değer. Değer değişince (ör. test bitince) kaldığı yerden yeni değere sayar.
const shown = { views: 0, tests: 0 };
const frames = {};
const fmtCache = new Map();

function fmt(n) {
	const loc = t("meta.dateLocale");
	let f = fmtCache.get(loc);
	if (!f) fmtCache.set(loc, (f = new Intl.NumberFormat(loc)));
	return f.format(n);
}

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function countTo(el, key, target) {
	cancelAnimationFrame(frames[key]);
	const from = shown[key];
	// Değer aynıysa (ör. dil değişti) ya da hareket azaltma açıksa animasyonsuz yaz
	if (from === target || reduceMotion()) {
		shown[key] = target;
		el.textContent = fmt(target);
		return;
	}
	// Fark büyüdükçe süre biraz uzar, en fazla 1,6 sn
	const duration = Math.min(1600, 600 + Math.log10(Math.abs(target - from) + 1) * 350);
	const start = performance.now();
	el.textContent = fmt(from);
	const step = (now) => {
		const p = Math.min(1, (now - start) / duration);
		const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
		shown[key] = p < 1 ? Math.round(from + (target - from) * eased) : target;
		el.textContent = fmt(shown[key]); // her karede güncel dil biçimiyle
		if (p < 1) frames[key] = requestAnimationFrame(step);
	};
	frames[key] = requestAnimationFrame(step);
}

function render() {
	const box = document.getElementById("stats");
	if (!box || !counts) return;
	// İkisi de 0 ise (yeni kurulum) kutuyu gösterme
	if (counts.views === 0 && counts.tests === 0) return;
	box.hidden = false;
	countTo(document.getElementById("stat-views"), "views", counts.views);
	countTo(document.getElementById("stat-tests"), "tests", counts.tests);
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

// Her test için sayfa yüklemesi başına en fazla bir kez sayılır (cevapları düzenleyip yeniden bitirmek tekrar saymaz)
export function trackTestCompleted(testId) {
	if (completedSent.has(testId)) return;
	completedSent.add(testId);

	gcHit(STATS.paths.testDone.replace("{id}", testId));

	if (workerUrl && shouldTrack()) {
		callWorker("POST", `/tally/test/${encodeURIComponent(testId)}`)
			.then((c) => { counts = c; render(); })
			.catch((err) => console.warn("Test sayısı gönderilemedi:", err.message));
	}
}