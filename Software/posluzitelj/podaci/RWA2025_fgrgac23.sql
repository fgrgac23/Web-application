-- Creator:       MySQL Workbench 8.0.45/ExportSQLite Plugin 0.1.0
-- Author:        Fićo
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2026-01-11 02:33
-- Created:       2025-11-02 20:55

BEGIN;
CREATE TABLE "korisnik"(
  "korisnik_id" INTEGER PRIMARY KEY NOT NULL CHECK("korisnik_id">=0),
  "ime" VARCHAR(30),
  "prezime" VARCHAR(30),
  "email" VARCHAR(40) NOT NULL,
  "korime" VARCHAR(15) NOT NULL,
  "lozinka" VARCHAR(100) NOT NULL,
  "sol" VARCHAR(45) NOT NULL,
  "drzava" VARCHAR(45),
  "grad" VARCHAR(45),
  "opis" VARCHAR(300),
  "br_neuspjesne_prijave" INTEGER NOT NULL DEFAULT 0,
  "kreiran" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "blokiran" INTEGER NOT NULL DEFAULT 0,
  "uloga" TEXT NOT NULL DEFAULT 'korisnik',
  "aktiviran" INTEGER NOT NULL,
  CONSTRAINT "email_UNIQUE"
    UNIQUE("email"),
  CONSTRAINT "korime_UNIQUE"
    UNIQUE("korime")
);
CREATE TABLE "kolekcija"(
  "kolekcija_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL CHECK("kolekcija_id">=0),
  "naziv" VARCHAR(100) NOT NULL,
  "opis" VARCHAR(250),
  "javno" INTEGER NOT NULL,
  "url_slika" VARCHAR(200),
  CONSTRAINT "kolekcija_id_UNIQUE"
    UNIQUE("kolekcija_id")
);
CREATE TABLE "korisnik_kolekcija"(
  "korisnik_id" INTEGER NOT NULL CHECK("korisnik_id">=0),
  "kolekcija_id" INTEGER NOT NULL CHECK("kolekcija_id">=0),
  "uloga_kolekcija" TEXT NOT NULL CHECK("uloga_kolekcija" IN('vlasnik', 'urednik')),
  PRIMARY KEY("korisnik_id","kolekcija_id"),
  CONSTRAINT "fk_korisnik"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("korisnik_id")
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT "fk_kolekcija"
    FOREIGN KEY("kolekcija_id")
    REFERENCES "kolekcija"("kolekcija_id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE INDEX "korisnik_kolekcija.fk_kolekcija_idx" ON "korisnik_kolekcija" ("kolekcija_id");
CREATE TABLE "sadrzaj"(
  "sadrzaj_id" INTEGER PRIMARY KEY NOT NULL CHECK("sadrzaj_id">=0),
  "naziv" VARCHAR(100) NOT NULL,
  "autor" VARCHAR(45) NOT NULL,
  "putanja" VARCHAR(300) NOT NULL,
  "vrsta" VARCHAR(20) NOT NULL,
  "naslov" VARCHAR(100) NOT NULL,
  "izvor" TEXT NOT NULL,
  "javno" INTEGER NOT NULL,
  "velicina" INTEGER NOT NULL,
  "datum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "tmdb_id" INTEGER NOT NULL,
  "yt_video_id" TEXT,
  CONSTRAINT "tmdb_id_UNIQUE"
    UNIQUE("tmdb_id")
);
CREATE TABLE "kolekcija_sadrzaj"(
  "kolekcija_id" INTEGER NOT NULL CHECK("kolekcija_id">=0),
  "sadrzaj_id" INTEGER NOT NULL CHECK("sadrzaj_id">=0),
  PRIMARY KEY("kolekcija_id","sadrzaj_id"),
  CONSTRAINT "fk_kolekcija"
    FOREIGN KEY("kolekcija_id")
    REFERENCES "kolekcija"("kolekcija_id")
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT "fk_sadrzaj"
    FOREIGN KEY("sadrzaj_id")
    REFERENCES "sadrzaj"("sadrzaj_id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
COMMIT;
