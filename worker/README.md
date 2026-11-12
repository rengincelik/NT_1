# Sayaç Worker'ı

Cloudflare Workers + D1. Görüntülenme sayısını ve her test için tamamlanma sayısını tutar (şu an iki test: `sns`, `ess`). API ve veri modeli için `../ARCHITECTURE.md` (`worker/` bölümü).

## API

| İstek | Ne yapar |
|---|---|
| `GET /tally` | `{ views, tests, byTest }` döndürür. `tests` = tüm testlerin toplamı, `byTest` = `{ sns: n, ess: n }` |
| `POST /tally/view` | `views` +1, güncel sayıları döndürür |
| `POST /tally/test/<id>` | `test_<id>` +1, güncel sayıları döndürür |

- `<id>` yalnızca `src/index.js > TEST_IDS` içindeyse kabul edilir (`sns`, `ess`), değilse 404. Eski `POST /tally/test` rotası yok (404).
- `POST` yalnızca `ALLOWED_ORIGINS` içindeki sitelerden kabul edilir, değilse 403.
- Tablo: `counters(name TEXT PRIMARY KEY, n INTEGER)`. Satırlar `views` ve her test için `test_<id>`. Satırlar ilk artırmada kendiliğinden oluşur, şemada başlangıç satırı gerekmez.

## İlk kurulum (hesap açma dahil)

1. **Cloudflare hesabı aç**: https://dash.cloudflare.com/sign-up (ücretsiz plan yeterli, kart istemez). E-postanı doğrula.
2. **Node.js** kurulu olsun (`node -v`). `wrangler`'ı ayrıca kurmana gerek yok, `npx` getirir.
3. Terminalde bu klasörde (`worker/`):

```bash
npx wrangler login
```

Tarayıcı açılır, Cloudflare'a izin ver.

4. **D1 veritabanını oluştur**:

```bash
npx wrangler d1 create narkolepsi-tally
```

Çıktıdaki `database_id`'yi `wrangler.toml` içindeki `[[d1_databases]]` bölümüne yaz (`binding = "DB"` kalmalı, kod `env.DB` kullanıyor).

5. **`ALLOWED_ORIGINS`'i doldur** (`wrangler.toml`): sitenin yayın adresi, sonunda `/` olmadan. Origin yalnızca şema + alan adıdır, yol içermez. GitHub Pages için:

```
https://rengincelik.github.io
```

(`/NT_1/` kısmı yazılmaz.) Birden fazla adres virgülle ayrılır. Yerel geliştirme adresleri (`http://localhost:8000`, `http://127.0.0.1:8000`) zaten varsayılan olarak durabilir.

6. **Tabloyu oluştur ve yayınla**:

```bash
npx wrangler d1 execute narkolepsi-tally --remote --file=schema.sql
npx wrangler deploy
```

7. `deploy` çıktısındaki adresi (`https://<worker-adı>.<hesap>.workers.dev`) `../js/config.js` içinde `STATS.workerUrl` olarak yaz, siteyi yeniden yayınla.

## Yayında doğrulama

```bash
# okuma (origin gerekmez)
curl https://<worker-adresi>/tally
# beklenen: {"views":0,"tests":0,"byTest":{"sns":0,"ess":0}}

# artırma (origin başlığı zorunlu)
curl -X POST -H "Origin: https://rengincelik.github.io" https://<worker-adresi>/tally/test/ess
# beklenen: ess 1 olmuş sayılar

# izinsiz origin → 403, bilinmeyen test → 404
curl -X POST -H "Origin: https://baska.site" https://<worker-adresi>/tally/view
curl -X POST -H "Origin: https://rengincelik.github.io" https://<worker-adresi>/tally/test/xyz
```

Sonra sitede: Home'da sayılar geliyor mu, `sns` ve `ess` testlerini bitirince "tamamlanan test" artıyor mu. Kendi tarayıcının saymaması için konsolda `localStorage.setItem("skipgc","t")` çalıştır. Test amaçlı artırdığın sayıları sıfırlamak istersen:

```bash
npx wrangler d1 execute narkolepsi-tally --remote --command="DELETE FROM counters"
```

## Yerelde deneme

```bash
npx wrangler d1 execute narkolepsi-tally --local --file=schema.sql
npx wrangler dev --local
```

Site yerelde `http://localhost:8000` ya da `http://127.0.0.1:8000` ile açılıyorsa `ALLOWED_ORIGINS` varsayılanı yeterlidir. Yerelde açılan site sayım yapmaz (sadece sayıları okur).

## Yeni test eklenince

`src/index.js > TEST_IDS` listesine id'yi ekle ve `npx wrangler deploy` ile yeniden yayınla. Eklenmezse o testin sayımı 404 alır (sayfa bozulmaz). D1 şemasında değişiklik gerekmez.

## Notlar

- `ALLOWED_ORIGINS` ya da `TEST_IDS` değişince Worker'ı yeniden yayınla (`npx wrangler deploy`).
- Ücretsiz plan limitleri: günde 100.000 Worker isteği, D1'de günde 100.000 satır yazma. Aşılırsa istekler hata verir, site bozulmaz (sayı kutusu gizlenir).
- Reklam engelleyiciler `workers.dev` isteğini engelleyebilir. Engellenirse sayılar düşük kalır, çözüm Worker'ı kendi alan adına bağlamaktır.
- `.wrangler/` ve `.dev.vars` repoya girmemeli (`.gitignore`).
