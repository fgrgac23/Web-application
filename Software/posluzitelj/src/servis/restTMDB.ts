import { FilmoviTmdbI } from "../servisI/tmdbI.js";
import { Request, Response } from "express";
import { TMDBklijent } from "./tmdbDAO.js";
import { RWASession } from "../servisI/korisnikI.js";
import { SadrzajI } from "../servisI/sadrzajI.js";
import { SadrzajDAO } from "./sadrzajDAO.js";

export class RestTMDB {
	private tmdbKlijent: TMDBklijent;
	private sdao = new SadrzajDAO();

	constructor(api_kljuc: string) {
		this.tmdbKlijent = new TMDBklijent(api_kljuc);
		console.log(api_kljuc);

		this.tmdbKlijent
			.dohvatiFilm(500)
			.then((podaci: any) => {
				if (podaci.status_code == 7) {
					console.log("Servis TMDB ne vraća podatke. Provjerite API ključ!");
				} else {
					console.log("Servis TMDB vraća podatke!");
				}
			})
			.catch(console.log);
	}

	getFilmovi(zahtjev: Request, odgovor: Response) {
		console.log(this);
		odgovor.type("application/json");

		let sesija = zahtjev.session as RWASession;
		if (sesija.korisnik == null) {
			odgovor.status(401);
			odgovor.send({ greska: "Neautoriziran pristup!" });
			return;
		}

		let stranica = zahtjev.query["stranica"];
		let trazi = zahtjev.query["trazi"];

		if (
			stranica == null ||
			trazi == null ||
			typeof stranica != "string" ||
			typeof trazi != "string"
		) {
			odgovor.status(417);
			odgovor.send({ greska: "neocekivani podaci" });
			return;
		}

		this.tmdbKlijent
			.pretraziFilmovePoNazivu(trazi, parseInt(stranica))
			.then((filmovi: FilmoviTmdbI) => {
				odgovor.send(filmovi);
			})
			.catch((greska) => {
				odgovor.json(greska);
			});
	}

	async getSlike(zahtjev: Request, odgovor: Response) {
		let sesija = zahtjev.session as RWASession;
		if (sesija.korisnik == null) {
			odgovor.status(401);
			odgovor.send({ greska: "Neautoriziran pristup!" });
			return;
		}

		let id = zahtjev.query["id"];

		if (!id || typeof id !== "string") {
			odgovor.status(417).json({ greska: "Nedostaje id!" });
			return;
		}

		this.tmdbKlijent
			.dohvatiSlike(Number(id))
			.then((s) => odgovor.json(s))
			.catch((e) => odgovor.status(500).json(e));
	}

	async getVideo(zahtjev: Request, odgovor: Response) {
		let sesija = zahtjev.session as RWASession;
		if (sesija.korisnik == null) {
			odgovor.status(401).json({ greska: "Neautoriziran pristup!" });
			return;
		}

		const id = Number(zahtjev.query["id"]);
		if (!id) {
			odgovor.status(417).json({ greska: "Nedostaje TMDB id!" });
			return;
		}

		try {
			const ytId = await this.tmdbKlijent.dohvatiVideo(id);
			odgovor.json({ yt_video_id: ytId });
		} catch (err) {
			console.error(err);
			odgovor.status(500).json({ greska: "Greška pri dohvaćanju videa" });
		}
	}

	async dodajSadrzaj(zahtjev: Request, odgovor: Response) {
		let sesija = zahtjev.session as RWASession;
		if (sesija.korisnik == null) {
			odgovor.status(401);
			odgovor.send({ greska: "Neautoriziran pristup!" });
			return;
		}

		let podaci = zahtjev.body;

		if (!podaci.naziv || !podaci.putanja || !podaci.vrsta || !podaci.naslov) {
			odgovor.status(417);
			odgovor.send({ greska: "Nedostaju podaci!" });
			return;
		}

		let zapis: SadrzajI = {
			naziv: podaci.naziv,
			autor: sesija.korisnik,
			putanja: podaci.putanja,
			vrsta: podaci.vrsta,
			naslov: podaci.naslov,
			izvor: podaci.izvor,
			datum: podaci.datum,
			javno: podaci.javno,
			velicina: podaci.velicina,
			tmdb_id: podaci.tmdb_id,
			yt_video_id: podaci.yt_video_id,
		};

		try {
			let id = await this.sdao.dodajSadrzaj(zapis);
			odgovor.json({ status: "OK", sadrzaj_id: id });
		} catch (err) {
			console.log(err);
			odgovor.status(500).json({ greska: "Greška pri upisu u bazu!" });
		}
	}

	async dodajSadrzajUKolekciju(zahtjev: Request, odgovor: Response) {
		let sesija = zahtjev.session as RWASession;
		if (sesija.korisnik == null) {
			odgovor.status(401);
			odgovor.send({ greska: "Neautoriziran pristup!" });
			return;
		}

		let kolekcija_id = Number(zahtjev.body.kolekcija_id);
		let sadrzaj_id = Number(zahtjev.body.sadrzaj_id);

		if (!kolekcija_id || !sadrzaj_id) {
			odgovor.status(417);
			odgovor.send({ greska: "Nedostaju podaci!" });
			return;
		}

		try {
			await this.sdao.dodajSadrzajUKolekciju(sadrzaj_id, kolekcija_id);
			odgovor.json({ status: "OK" });
		} catch (err) {
			console.error(err);
			odgovor
				.status(500)
				.json({ greska: "Greška pri spremanju sadržaja u kolekciju." });
		}
	}

	async promjeniVidljivost(zahtjev: Request, odgovor: Response) {
		let id = Number(zahtjev.params["id"]);
		let javno = Number(zahtjev.body.javno);

		if (!id || javno == null)
			return odgovor.status(400).json({ greska: "Neispravni podaci" });

		await this.sdao.promjeniVidljivost(id, javno);
		return odgovor.json({ status: "Uspjeh" });
	}

	async obrisiSadrzajIzKolekcije(zahtjev: Request, odgovor: Response) {
		const kolekcija_id = Number(zahtjev.params["id"]);
		const sadrzaj_id = Number(zahtjev.params["sid"]);

		if (isNaN(kolekcija_id) || isNaN(sadrzaj_id)) {
			odgovor.status(400).json({ greska: "Neispravan ID!" });
			return;
		}

		await this.sdao.obrisiSadrzajIzKolekcije(kolekcija_id, sadrzaj_id);

		const josPostoji = await this.sdao.sadrzajJeUKojimKolekcijama(sadrzaj_id);

		if (!josPostoji) {
			await this.sdao.obrisiSadrzaj(sadrzaj_id);
		}

		odgovor.json({ status: "Uspješno" });
	}
}
