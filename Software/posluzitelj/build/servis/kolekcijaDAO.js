import Baza from "../zajednicko/sqliteBaza.js";
export class KolekcijaDAO {
    baza;
    constructor() {
        this.baza = new Baza("podaci/RWA2025fgrgac23.sqlite");
        this.baza.spoji();
    }
    async dajJavne() {
        let sql = "SELECT * FROM kolekcija WHERE javno = 1";
        return await this.baza.dajPodatke(sql, []);
    }
    async kreirajKolekciju(kolekcija, korisnik_id) {
        let sql = "INSERT INTO kolekcija (naziv, opis, javno, url_slika) VALUES (?,?,?,?)";
        let podaci = await this.baza.ubaciAzurirajPodatke(sql, [
            kolekcija.naziv,
            kolekcija.opis,
            kolekcija.javno,
            kolekcija.url_slika,
        ]);
        let kolekcijaID = podaci.lastID;
        await this.dodajKorisnikaUKolekciju(korisnik_id, kolekcijaID, "vlasnik");
        return kolekcijaID;
    }
    async dodajKorisnikaUKolekciju(korisnik_id, kolekcija_id, uloga) {
        let sql = "INSERT OR REPLACE INTO korisnik_kolekcija (korisnik_id, kolekcija_id, uloga_kolekcija) VALUES (?,?,?)";
        await this.baza.ubaciAzurirajPodatke(sql, [
            korisnik_id,
            kolekcija_id,
            uloga,
        ]);
    }
    async dajKolekcije() {
        let sql = `SELECT k.kolekcija_id, k.naziv, k.opis, k.javno, kor.korisnik_id, kor.korime, kk.uloga_kolekcija FROM kolekcija k LEFT JOIN korisnik_kolekcija kk ON kk.kolekcija_id = k.kolekcija_id LEFT JOIN korisnik kor ON kor.korisnik_id = kk.korisnik_id ORDER BY k.kolekcija_id`;
        let redovi = (await this.baza.dajPodatke(sql, []));
        const rezultat = [];
        let trenutna = null;
        for (const r of redovi) {
            if (trenutna === null || trenutna.kolekcija_id !== r.kolekcija_id) {
                if (trenutna !== null)
                    rezultat.push(trenutna);
                trenutna = {
                    kolekcija_id: r.kolekcija_id,
                    naziv: r.naziv,
                    opis: r.opis,
                    javno: r.javno,
                    vlasnik: r.korime,
                    korisnici: [],
                };
            }
            if (r.korime !== null &&
                r.uloga_kolekcije !== null &&
                r.korisnik_id !== null) {
                if (r.uloga_kolekcije === "vlasnik") {
                    trenutna.vlasnik = r.korime;
                }
                else {
                    trenutna.korisnici.push({
                        korisnik_id: r.korisnik_id,
                        korime: r.korime,
                        uloga_kolekcije: r.uloga_kolekcije,
                    });
                }
            }
        }
        if (trenutna !== null)
            rezultat.push(trenutna);
        return rezultat;
    }
    async dajKolekcijeKorisnika(korisnik_id) {
        let sql = `SELECT k.kolekcija_id, k.naziv, k.javno, k.opis, k.url_slika FROM kolekcija k INNER JOIN korisnik_kolekcija kk ON kk.kolekcija_id = k.kolekcija_id INNER JOIN korisnik kor ON kor.korisnik_id = kk.korisnik_id WHERE kor.korisnik_id = ? ORDER BY k.kolekcija_id DESC`;
        return await this.baza.dajPodatke(sql, [korisnik_id]);
    }
    async dajsadrzajZaKolekciju(kolekcija_id) {
        let sql = `SELECT * FROM sadrzaj s INNER JOIN kolekcija_sadrzaj ks ON ks.sadrzaj_id = s.sadrzaj_id WHERE ks.kolekcija_id = ?`;
        return await this.baza.dajPodatke(sql, [kolekcija_id]);
    }
    async dajjavnisadrzajZaKolekciju(kolekcija_id) {
        let sql = `SELECT * FROM sadrzaj s INNER JOIN kolekcija_sadrzaj ks ON ks.sadrzaj_id = s.sadrzaj_id WHERE ks.kolekcija_id = ? AND s.javno = 1`;
        return await this.baza.dajPodatke(sql, [kolekcija_id]);
    }
    async promjeniJavnostKolekcije(kolekcija_id, javno) {
        let sql = "UPDATE kolekcija SET javno = ? WHERE kolekcija_id = ?";
        return await this.baza.ubaciAzurirajPodatke(sql, [javno, kolekcija_id]);
    }
    async postaviIstaknutuSliku(kolekcija_id, putanjaSlike) {
        let sql = "UPDATE kolekcija SET url_slika = ? WHERE kolekcija_id = ?";
        return await this.baza.ubaciAzurirajPodatke(sql, [
            putanjaSlike,
            kolekcija_id,
        ]);
    }
    async dajJavniSadrzaj() {
        const sql = `
		SELECT
			s.sadrzaj_id,
			s.naslov,
			s.putanja,
			s.autor,
			s.vrsta,
			s.izvor AS opis,
			s.datum
		FROM sadrzaj s
		WHERE s.javno = 1
	`;
        return await this.baza.dajPodatke(sql, []);
    }
    async pretraziJavniSadrzaj(pojam) {
        let sql = `
		SELECT 
			s.sadrzaj_id,
			s.naslov,
			s.putanja,
			s.autor,
			s.vrsta,
			s.izvor AS opis,
			s.datum
		FROM sadrzaj s
		WHERE s.javno = 1 AND LOWER(s.naslov) LIKE ?`;
        return await this.baza.dajPodatke(sql, [`%${pojam.toLowerCase()}%`]);
    }
    async filtrirajSadrzaj(autor, datumOd, datumDo) {
        let sql = `
		SELECT
			s.sadrzaj_id,
			s.naslov,
			s.putanja,
			s.autor,
			s.vrsta,
			s.izvor AS opis,
			s.datum
		FROM sadrzaj s
		WHERE s.javno = 1`;
        const params = [];
        if (autor) {
            sql += ` AND s.autor = ?`;
            params.push(autor);
        }
        if (datumOd) {
            sql += ` AND DATE(s.datum) >= DATE(?)`;
            params.push(datumOd);
        }
        if (datumDo) {
            sql += ` AND DATE(s.datum) <= DATE(?)`;
            params.push(datumDo);
        }
        sql += ` ORDER BY s.datum DESC`;
        return await this.baza.dajPodatke(sql, params);
    }
}
//# sourceMappingURL=kolekcijaDAO.js.map