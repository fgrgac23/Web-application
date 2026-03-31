import Baza from "../zajednicko/sqliteBaza.js";
import { SadrzajI } from "../servisI/sadrzajI.js";

export class SadrzajDAO {
	private baza: Baza;

	constructor() {
		this.baza = new Baza("podaci/RWA2025fgrgac23.sqlite");
		this.baza.spoji();
	}

	async dajSadrzajPoTmdbId(tmdbId: number) {
		const sql = `SELECT * FROM sadrzaj WHERE tmdb_id = ?`;
		const redovi = await this.baza.dajPodatke(sql, [tmdbId]);
		return redovi.length > 0 ? redovi[0] : null;
	}

	async dodajSadrzaj(s: SadrzajI): Promise<number> {
		if (typeof s.tmdb_id === "number") {
			const postojeci = await this.dajSadrzajPoTmdbId(s.tmdb_id);
			if (postojeci && typeof postojeci.sadrzaj_id === "number") {
				return postojeci.sadrzaj_id;
			}
		}
		const sql = `
    INSERT INTO sadrzaj
      (naziv, autor, putanja, vrsta, naslov, izvor, datum, javno, velicina, tmdb_id, yt_video_id)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `;

		try {
			const podaci = await this.baza.ubaciAzurirajPodatke(sql, [
				s.naziv,
				s.autor,
				s.putanja,
				s.vrsta,
				s.naslov,
				s.izvor,
				s.datum,
				s.javno,
				s.velicina,
				s.tmdb_id ?? null,
				s.yt_video_id ?? null,
			]);

			return podaci.lastID;
		} catch (err: any) {
			if (typeof s.tmdb_id === "number") {
				const postojeci = await this.dajSadrzajPoTmdbId(s.tmdb_id);
				if (postojeci && typeof postojeci.sadrzaj_id === "number") {
					return postojeci.sadrzaj_id;
				}
			}
			throw err;
		}
	}

	async dodajSadrzajUKolekciju(sadrzaj_id: number, kolekcija_id: number) {
		let sql = `INSERT INTO kolekcija_sadrzaj (kolekcija_id, sadrzaj_id) VALUES (?,?)`;
		await this.baza.ubaciAzurirajPodatke(sql, [kolekcija_id, sadrzaj_id]);
	}

	async promjeniVidljivost(sadrzaj_id: number, javno: number) {
		let sql = `UPDATE sadrzaj SET javno = ? WHERE sadrzaj_id = ?`;
		await this.baza.ubaciAzurirajPodatke(sql, [javno, sadrzaj_id]);
	}

	async obrisiSadrzajIzKolekcije(
		kolekcija_id: number,
		sadrzaj_id: number
	): Promise<void> {
		const sql =
			"DELETE FROM kolekcija_sadrzaj WHERE kolekcija_id = ? AND sadrzaj_id = ?";
		await this.baza.ubaciAzurirajPodatke(sql, [kolekcija_id, sadrzaj_id]);
	}

	async sadrzajJeUKojimKolekcijama(sadrzaj_id: number): Promise<boolean> {
		const sql =
			"SELECT COUNT(*) AS broj FROM kolekcija_sadrzaj WHERE sadrzaj_id = ?";

		const rezultat = await this.baza.dajPodatke(sql, [sadrzaj_id]);

		if (!Array.isArray(rezultat) || rezultat.length === 0) {
			return false;
		}

		const prviRed = rezultat[0] as { broj?: number };

		if (typeof prviRed.broj !== "number") {
			return false;
		}

		return prviRed.broj > 0;
	}

	async obrisiSadrzaj(sadrzaj_id: number): Promise<void> {
		const sql = "DELETE FROM sadrzaj WHERE sadrzaj_id = ?";
		await this.baza.ubaciAzurirajPodatke(sql, [sadrzaj_id]);
	}
}
