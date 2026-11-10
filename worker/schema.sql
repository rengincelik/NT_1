-- Tek tablo, iki satır. Çalıştırmak tekrar çalıştırılabilir (mevcut sayıları sıfırlamaz).
CREATE TABLE IF NOT EXISTS counters (
  name TEXT PRIMARY KEY,
  n    INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO counters (name, n) VALUES ('views', 0), ('tests', 0);
