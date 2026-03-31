import { KolekcijaI } from "../servisI/kolekcijaI";
import { RWASession } from "../servisI/korisnikI";
import { KolekcijaDAO } from "./kolekcijaDAO.js";
import { Request, Response } from "express";

export class RestKolekcija {
	private kdao = new KolekcijaDAO();

	private provjeriModeratora(zahtjev: Request, odgovor: Response): boolean {
		const sesija = zahtjev.session as RWASession;
		if (!sesija.korisnik) {
			odgovor.status(401).json({ greska: "Neautoriziran pristup" });
			return false;
		}

		if (sesija.uloga !== "administrator" && sesija.uloga !== "moderator") {
			odgovor
				.status(403)
				.json({ greska: "Zabranjen pristup. Niste moderator ili admin." });
			return false;
		}
		return true;
	}

	async dajJavne(zahtjev: Request, odgovor: Response) {
		let podaci = await this.kdao.dajJavne();
		odgovor.json(podaci);
	}

	async kreirajKolekciju(zahtjev: Request, odgovor: Response) {
		if (!this.provjeriModeratora(zahtjev, odgovor)) return;

		let sesija = zahtjev.session as RWASession;
		let kolekcija: KolekcijaI = zahtjev.body;

		if (!kolekcija.naziv || typeof kolekcija.naziv !== "string") {
			odgovor.status(417).json({ greska: "Neispravan naziv kolekcije!" });
			return;
		}

		kolekcija.javno = Number(kolekcija.javno ?? 0);

		let id = await this.kdao.kreirajKolekciju(kolekcija, sesija.korisnik_id);

		odgovor.status(201).json({ status: "Uspješno", kolekcija_id: id });
	}

	async dodajKorisnika(zahtjev: Request, odgovor: Response) {
		if (!this.provjeriModeratora(zahtjev, odgovor)) return;

		let kolekcija_id: number = Number(zahtjev.params["id"]);
		let korisnik_id: number = Number(zahtjev.body.korisnik_id);
		let uloga: "vlasnik" | "urednik" = zahtjev.body.uloga;

		if (!korisnik_id || (uloga !== "vlasnik" && uloga !== "urednik")) {
			odgovor.status(417).json({ greska: "Neispravni podaci!" });
			return;
		}

		await this.kdao.dodajKorisnikaUKolekciju(korisnik_id, kolekcija_id, uloga);
		odgovor.status(201).json({ status: "Uspješno" });
	}

	async dajKolekcijeModerator(
		zahtjev: Request,
		odgovor: Response
	): Promise<void> {
		if (!this.provjeriModeratora(zahtjev, odgovor)) return;

		let podaci = await this.kdao.dajKolekcije();
		odgovor.json(podaci);
	}

	async dajMojeKolekcije(zahtjev: Request, odgovor: Response): Promise<void> {
		let sesija = zahtjev.session as RWASession;

		if (!sesija.korisnik_id) {
			odgovor.status(401).json({ greska: "Neautoriziran pristup!" });
			return;
		}

		let kolekcije = await this.kdao.dajKolekcijeKorisnika(sesija.korisnik_id);
		odgovor.json(kolekcije);
	}

	async dajsadrzajKolekcije(
		zahtjev: Request,
		odgovor: Response
	): Promise<void> {
		let kolekcija_id: number = Number(zahtjev.params["id"]);

		if (isNaN(kolekcija_id)) {
			odgovor.status(400).json({ greska: "Neispravan ID kolekcije!" });
			return;
		}

		try {
			let sadrzaj = await this.kdao.dajsadrzajZaKolekciju(kolekcija_id);
			odgovor.json(sadrzaj);
		} catch (err) {
			console.log("Greška kod dohvaćanja sadržaja kolkekcije! ", err);
			odgovor.status(500).json({ greska: "Greška u servisu" });
		}
	}

	async dajjavnisadrzajKolekcije(zahtjev: Request, odgovor: Response) {
		const kolekcijaId = Number(zahtjev.params["id"]);

		const podaci = await this.kdao.dajjavnisadrzajZaKolekciju(kolekcijaId);

		odgovor.json(podaci);
	}

	async promjenaJavnostiKolekcije(zahtjev: Request, odgovor: Response) {
		let kolekcija_id: number = Number(zahtjev.params["id"]);
		let javno: number = Number(zahtjev.body.javno);

		if (isNaN(kolekcija_id) || isNaN(javno)) {
			odgovor
				.status(400)
				.json({ greska: "Neispravan ID kolekcije ili javnost!" });
			return;
		}

		try {
			await this.kdao.promjeniJavnostKolekcije(kolekcija_id, javno);
			odgovor.json({ status: "Uspješno" });
		} catch (err) {
			console.log(err);
			odgovor
				.status(500)
				.json({ greska: "Greška pri promjeni javnosti kolekcije!" });
		}
	}

	async postaviIstaknutuSliku(zahtjev: Request, odgovor: Response) {
		let kolekcija_id: number = Number(zahtjev.params["id"]);
		let putanjaSlike: string = zahtjev.body.putanja;

		if (isNaN(kolekcija_id) || !putanjaSlike) {
			odgovor
				.status(400)
				.json({ greska: "Neispravan ID kolekcije ili putanja slike!" });
			return;
		}

		try {
			await this.kdao.postaviIstaknutuSliku(kolekcija_id, putanjaSlike);
			odgovor.json({ status: "Uspješno" });
		} catch (err) {
			console.log(err);
			odgovor
				.status(500)
				.json({ greska: "Greška pri promjeni jistaknute slike!" });
		}
	}
	async dohvatiJavniSadrzaj(zahtjev: Request, odgovor: Response) {
		const sesija = zahtjev.session as RWASession;

		if (!sesija.korisnik_id) {
			odgovor.status(401).json({ greska: "Neautoriziran pristup!" });
			return;
		}

		const trazi = zahtjev.query["trazi"];

		try {
			if (
				trazi == null ||
				typeof trazi !== "string" ||
				trazi.trim().length === 0
			) {
				const podaci = await this.kdao.dajJavniSadrzaj();
				odgovor.json(podaci);
				return;
			}

			const pojam = trazi.trim();

			if (pojam.length < 3) {
				odgovor
					.status(417)
					.json({ greska: "Upišite minimalno 3 znaka za pretraživanje." });
				return;
			}

			const podaci = await this.kdao.pretraziJavniSadrzaj(pojam);
			odgovor.json(podaci);
		} catch (err) {
			console.log(err);
			odgovor.status(500).json({
				greska: "Greška pri dohvaćanju javnog sadržaja",
			});
		}
	}

	async filtrirajSadrzaj(zahtjev: Request, odgovor: Response) {
		const sesija = zahtjev.session as RWASession;

		if (!sesija.korisnik_id) {
			odgovor.status(401).json({ greska: "Neautoriziran pristup" });
			return;
		}

		const autor =
			typeof zahtjev.query["autor"] === "string"
				? zahtjev.query["autor"]
				: null;

		const datumOd =
			typeof zahtjev.query["datumOd"] === "string"
				? zahtjev.query["datumOd"]
				: null;

		const datumDo =
			typeof zahtjev.query["datumDo"] === "string"
				? zahtjev.query["datumDo"]
				: null;

		if (!autor && !datumOd && !datumDo) {
			odgovor.json([]);
			return;
		}

		try {
			const podaci = await this.kdao.filtrirajSadrzaj(autor, datumOd, datumDo);
			odgovor.json(podaci);
		} catch (err) {
			console.log(err);
			odgovor.status(500).json({ greska: "Greška pri filtriranju" });
		}
	}
}
