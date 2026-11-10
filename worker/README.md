# Sayaç Worker'ı

Cloudflare Workers + D1. İki sayı tutar: görüntülenme ve tamamlanan test. API ve veri modeli için `../ARCHITECTURE.md` (`worker/` bölümü).

## Yayınlama

Cloudflare hesabı ve `wrangler` gerekir. Komutlar bu klasörde çalıştırılır.

```bash
npx wrangler login
npx wrangler d1 create narkolepsi-tally
```

Çıkan `database_id`'yi `wrangler.toml` içine yaz. `ALLOWED_ORIGINS`'e sitenin yayın adresini ekle (sonunda `/` olmadan, ör. `https://kullanici.github.io`). Sonra:

```bash
npx wrangler d1 execute narkolepsi-tally --remote --file=schema.sql
npx wrangler deploy
```

`deploy` çıktısındaki adresi `../js/config.js` içinde `STATS.workerUrl` olarak yaz.

## Yerelde deneme

```bash
npx wrangler d1 execute narkolepsi-tally --local --file=schema.sql
npx wrangler dev --local
```

Site yerelde `http://localhost:8000` ya da `http://127.0.0.1:8000` ile açılıyorsa `ALLOWED_ORIGINS` varsayılanı yeterlidir. Yerelde açılan site sayım yapmaz (sadece sayıları okur).

## Notlar

- `ALLOWED_ORIGINS` değişince Worker'ı yeniden yayınla (`npx wrangler deploy`).
- `.wrangler/` ve `.dev.vars` repoya girmemeli (`.gitignore`).
