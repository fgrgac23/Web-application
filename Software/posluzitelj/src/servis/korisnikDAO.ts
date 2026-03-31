import { KorisnikI } from "../servisI/korisnikI";
import Baza from "../zajednicko/sqliteBaza.js";

export class KorisnikDAO {
	private baza: Baza;

	constructor() {
		this.baza = new Baza("podaci/RWA2025fgrgac23.sqlite");
		this.baza.spoji();

		console.log("Koristim bazu:", this.baza);
	}

	async dajSve(): Promise<Array<KorisnikI>> {
		let sql = "SELECT * FROM korisnik ORDER BY korisnik_id ASC;";
		var podaci = (await this.baza.dajPodatke(sql, [])) as Array<KorisnikI>;
		let rezultat = new Array<KorisnikI>();
		for (let p of podaci) {
			let k: KorisnikI = {
				korisnik_id: p["korisnik_id"],
				ime: p["ime"],
				prezime: p["prezime"],
				korime: p["korime"],
				lozinka: p["lozinka"],
				sol: p["sol"],
				email: p["email"],
				uloga: p["uloga"],
				blokiran: p["blokiran"],
				br_neuspjesne_prijave: p["br_neuspjesne_prijave"],
				drzava: p["drzava"],
				grad: p["grad"],
				opis: p["opis"],
				kreiran: p["kreiran"],
				aktiviran: p["aktiviran"],
			};
			rezultat.push(k);
		}

		return rezultat;
	}

	async daj(korime: string): Promise<KorisnikI | null> {
		let sql = "SELECT * FROM korisnik WHERE korime=?;";
		var podaci = await this.baza.dajPodatke(sql, [korime]);

		if (podaci.length === 1 && podaci[0] != undefined) {
			let p = podaci[0];
			let k: KorisnikI = {
				korisnik_id: p["korisnik_id"],
				ime: p["ime"],
				prezime: p["prezime"],
				korime: p["korime"],
				lozinka: p["lozinka"],
				sol: p["sol"],
				email: p["email"],
				uloga: p["uloga"],
				blokiran: p["blokiran"],
				br_neuspjesne_prijave: p["br_neuspjesne_prijave"],
				drzava: p["drzava"],
				grad: p["grad"],
				opis: p["opis"],
				kreiran: p["kreiran"],
				aktiviran: p["aktiviran"],
			};
			return k;
		}

		return null;
	}

	async dodaj(korisnik: KorisnikI): Promise<void> {
		console.log(korisnik);
		let sql = `INSERT INTO korisnik (ime, prezime, korime, lozinka, sol, email, uloga, blokiran, br_neuspjesne_prijave, grad, drzava, opis ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
		let podaci = [
			korisnik.ime,
			korisnik.prezime,
			korisnik.korime,
			korisnik.lozinka,
			korisnik.sol,
			korisnik.email,
			korisnik.uloga,
			korisnik.blokiran,
			korisnik.br_neuspjesne_prijave,
			korisnik.grad,
			korisnik.drzava,
			korisnik.opis,
		];
		await this.baza.ubaciAzurirajPodatke(sql, podaci);
	}

	obrisi(korime: string) {
		let sql = "DELETE FROM korisnik WHERE korime=?";
		this.baza.ubaciAzurirajPodatke(sql, [korime]);
		return true;
	}

	azuriraj(korime: string, korisnik: KorisnikI) {
		let sql = `UPDATE korisnik SET ime=?, prezime=?, lozinka=?, email=?, uloga=?, blokiran=? br_neuspjesne_prijave=?, drzava=?, grad=?, opis=? WHERE korime=?`;
		let podaci = [
			korisnik.ime,
			korisnik.prezime,
			korisnik.lozinka,
			korisnik.sol,
			korisnik.email,
			korisnik.uloga,
			korisnik.blokiran,
			korisnik.br_neuspjesne_prijave,
			korisnik.drzava,
			korisnik.grad,
			korisnik.opis,
			korime,
		];
		this.baza.ubaciAzurirajPodatke(sql, podaci);
		return true;
	}

	async dajPoID(id: number) {
		let sql = "SELECT * FROM korisnik WHERE korisnik_id=?;";
		return await this.baza.dajPodatke(sql, [id]);
	}

	async povecajBrojPogresnePrijave(korime: string): Promise<void> {
		let sql =
			"UPDATE korisnik SET br_neuspjesne_prijave = br_neuspjesne_prijave + 1 WHERE korime = ?";
		console.log("Ažuriram pokušaje za:", korime);

		return await this.baza.ubaciAzurirajPodatke(sql, [korime]);
	}

	async resetirajPogresnePrijave(korime: string): Promise<void> {
		let sql = "UPDATE korisnik SET br_neuspjesne_prijave = 0 WHERE korime = ?";
		await this.baza.ubaciAzurirajPodatke(sql, [korime]);
	}

	async blokirajKorisnika(korime: string): Promise<void> {
		let sql = "UPDATE korisnik SET blokiran = 1 WHERE korime = ?";
		await this.baza.ubaciAzurirajPodatke(sql, [korime]);
	}

	async sviKorisnici() {
		let sql = "SELECT * FROM korisnik ORDER BY korisnik_id ASC";
		return await this.baza.izvrsiUpit(sql);
	}

	async blokiranjeKorisnika(korime: string) {
		let sql = "UPDATE korisnik SET blokiran = 1 WHERE korime = ?";
		await this.baza.ubaciAzurirajPodatke(sql, [korime]);
	}

	async odblokirajKorisnika(korime: string) {
		let sql = "UPDATE korisnik SET blokiran = 0 WHERE korime = ?";
		await this.baza.ubaciAzurirajPodatke(sql, [korime]);
	}

	async postaviUloguKorisnika(korime: string, uloga: string) {
		let sql = "UPDATE korisnik SET uloga = ? WHERE korime = ?";
		await this.baza.ubaciAzurirajPodatke(sql, [uloga, korime]);
	}

	async dajJednogKorisnika(id: number) {
		let sql = "SELECT * FROM korisnik WHERE korisnik_id = ?";
		await this.baza.dajPodatke(sql, [id]);
	}

	async aktivirajKorisnika(korime: string): Promise<void> {
		let sql = "UPDATE korisnik SET aktiviran = 1 WHERE korime = ?";
		await this.baza.ubaciAzurirajPodatke(sql, [korime]);
	}
}
