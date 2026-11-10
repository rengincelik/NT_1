// Sayaç Worker'ı (Cloudflare Workers + D1). Sadece iki tam sayı tutar: views, tests.
//
//   GET  /tally        → { views, tests }
//   POST /tally/view   → views +1, güncel sayıları döndürür
//   POST /tally/test   → tests +1, güncel sayıları döndürür
//
// Saklanan tek şey iki sayıdır: IP, ziyaretçi kimliği, cevap, dil yok.
// POST yalnızca ALLOWED_ORIGINS içindeki sitelerden kabul edilir (wrangler.toml). Bu bir güvenlik değil,
// başka sitelerin ve tesadüfi isteklerin sayıyı artırmasını engelleyen basit bir filtredir.

const COUNTERS = { view: "views", test: "tests" };

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

// incrementName verilirse önce o sayaç +1 yapılır. İkisi tek batch (tek işlem) içinde çalışır.
async function totals(db, incrementName) {
  const statements = [];
  if (incrementName) {
    statements.push(
      db
        .prepare("INSERT INTO counters (name, n) VALUES (?1, 1) ON CONFLICT(name) DO UPDATE SET n = n + 1")
        .bind(incrementName)
    );
  }
  statements.push(db.prepare("SELECT name, n FROM counters WHERE name IN ('views', 'tests')"));

  const results = await db.batch(statements);
  const rows = results[results.length - 1].results;

  const out = { views: 0, tests: 0 };
  for (const row of rows) out[row.name] = row.n;
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const allowed = (env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const originOk = origin !== null && allowed.includes(origin);

    // Tarayıcının yanıtı okuyabilmesi için izinli origin geri yansıtılır
    const cors = { Vary: "Origin", ...(originOk ? { "Access-Control-Allow-Origin": origin } : {}) };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: { ...cors, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Max-Age": "86400" },
      });
    }

    const path = url.pathname.replace(/\/+$/, "");

    try {
      if (request.method === "GET" && path === "/tally") {
        return json(await totals(env.DB), 200, cors);
      }

      if (request.method === "POST" && path.startsWith("/tally/")) {
        const key = path.slice("/tally/".length);
        if (!Object.hasOwn(COUNTERS, key)) return json({ error: "not found" }, 404, cors);
        if (!originOk) return json({ error: "forbidden" }, 403, cors);
        return json(await totals(env.DB, COUNTERS[key]), 200, cors);
      }

      return json({ error: "not found" }, 404, cors);
    } catch (err) {
      console.error(err);
      return json({ error: "server error" }, 500, cors);
    }
  },
};
