// Sayaç Worker'ı (Cloudflare Workers + D1). Sadece tam sayılar tutar: views ve her test için bir sayaç (test_<id>).
//
//   GET  /tally            → { views, tests, byTest }   tests = tüm testlerin toplamı, byTest = { <id>: n }
//   POST /tally/view       → views +1, güncel sayıları döndürür
//   POST /tally/test/<id>  → test_<id> +1, güncel sayıları döndürür (<id> TEST_IDS içinde olmalı)
//
// Saklanan tek şey birkaç sayıdır: IP, ziyaretçi kimliği, cevap, dil yok.
// POST yalnızca ALLOWED_ORIGINS içindeki sitelerden kabul edilir (wrangler.toml). Bu bir güvenlik değil,
// başka sitelerin ve tesadüfi isteklerin sayıyı artırmasını engelleyen basit bir filtredir.

// Sayılabilen test kimlikleri (site tarafında js/config.js > TESTS anahtarlarıyla aynı olmalı).
// Yeni test eklenince buraya da eklenip Worker yeniden yayınlanır. Listede olmayan id 404 alır.
const TEST_IDS = ["sns", "ess"];

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
  // Tablo küçüktür (views + test başına bir satır)
  statements.push(db.prepare("SELECT name, n FROM counters"));

  const results = await db.batch(statements);
  const rows = results[results.length - 1].results;

  const out = { views: 0, tests: 0, byTest: {} };
  for (const id of TEST_IDS) out.byTest[id] = 0;
  for (const { name, n } of rows) {
    if (name === "views") out.views = n;
    else if (name.startsWith("test_") && Object.hasOwn(out.byTest, name.slice(5))) {
      out.byTest[name.slice(5)] = n;
      out.tests += n;
    }
  }
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
        const rest = path.slice("/tally/".length);
        let counter = null;
        if (rest === "view") counter = "views";
        else if (rest.startsWith("test/") && TEST_IDS.includes(rest.slice("test/".length))) {
          counter = `test_${rest.slice("test/".length)}`;
        }
        if (!counter) return json({ error: "not found" }, 404, cors);
        if (!originOk) return json({ error: "forbidden" }, 403, cors);
        return json(await totals(env.DB, counter), 200, cors);
      }

      return json({ error: "not found" }, 404, cors);
    } catch (err) {
      console.error(err);
      return json({ error: "server error" }, 500, cors);
    }
  },
};
