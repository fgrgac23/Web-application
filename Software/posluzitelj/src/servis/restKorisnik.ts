import { KorisnikI, RWASession } from "../servisI/korisnikI";
import { KorisnikDAO } from "./korisnikDAO.js";
import { Request, Response } from "express";
import { kreirajToken } from "../zajednicko/jwt.js";
import { posaljiMail } from "./mail.js";
import * as kodovi from "../zajednicko/kodovi.js";
import jwt from "jsonwebtoken";
import { Konfiguracija } from "../zajednicko/konfiguracija.js";

export class RestKorisnik {
	private kdao: KorisnikDAO;
	private konf: Konfiguracija;

	constructor(konf: Konfiguracija) {
		this.kdao = new KorisnikDAO();
		this.konf = konf;
	}

	getKorisnici(zahtjev: Request, odgovor: Response) {
		this.kdao.dajSve().then((korisnici) => {
			odgovor.json(korisnici);
		});
	}

	async postKorisnici(zahtjev: Request, odgovor: Response) {
		const podaci = zahtjev.body;

		if (!podaci.korime || !podaci.lozinka || !podaci.email) {
			odgovor.status(417).json({ greska: "Nevaljani podaci" });
			return;
		}

		const korisnikPostoji = await this.kdao.daj(podaci.korime);
		if (korisnikPostoji) {
			odgovor.status(417).json({ greska: "Korisničko ime zauzeto!" });
			return;
		}

		const sol = kodovi.generirajSol();
		const hash = kodovi.kreirajSHA256(podaci.lozinka, sol);

		const noviKorisnik: KorisnikI = {
			korisnik_id: podaci.korisnik_id,
			ime: podaci.ime,
			prezime: podaci.prezime,
			korime: podaci.korime,
			lozinka: hash,
			sol,
			email: podaci.email,
			uloga: "korisnik",
			blokiran: 0,
			br_neuspjesne_prijave: 0,
			drzava: podaci.drzava,
			grad: podaci.grad,
			opis: podaci.opis,
			kreiran: null,
			aktiviran: 0,
		};

		await this.kdao.dodaj(noviKorisnik);

		const token = kreirajToken(
			{ korime: noviKorisnik.korime },
			this.konf.dajKonf().jwtAktivacija
		);

		const link = `http://localhost:12222/api/korisnik/aktivacija/${token}`;

		await posaljiMail(
			noviKorisnik.email,
			"Aktivacija korisničkog računa",
			`Aktivirajte račun: ${link}`,
			this.konf
		);

		odgovor.json({
			poruka: "Registracija uspješna. Provjerite e-mail.",
		});
	}

	async getKorisnik(zahtjev: Request, odgovor: Response) {
		const korimeParam = zahtjev.params["korime"];
		if (typeof korimeParam !== "string") {
			odgovor.status(400).json({ greska: "Neispravno korime" });
			return;
		}

		const korisnik = await this.kdao.daj(korimeParam);
		odgovor.json(korisnik);
	}

	async getKorisnikPrijava(zahtjev: Request, odgovor: Response) {
		const korimeParam = zahtjev.params["korime"];
		const lozinka = zahtjev.body.lozinka;

		if (typeof korimeParam !== "string" || !lozinka) {
			odgovor.status(401).json({ greska: "Neispravni podaci" });
			return;
		}

		const korisnik = await this.kdao.daj(korimeParam);
		if (!korisnik) {
			odgovor.status(401).json({ greska: "Neispravan korisnik" });
			return;
		}

		if (korisnik.aktiviran === 0) {
			odgovor.status(403).json({ greska: "Račun nije aktiviran" });
			return;
		}

		const hashLozinke = kodovi.kreirajSHA256(lozinka, korisnik.sol);

		if (korisnik.blokiran === 1) {
			odgovor.status(403).json({ greska: "Račun je blokiran" });
			return;
		}

		if (hashLozinke !== korisnik.lozinka) {
			await this.kdao.povecajBrojPogresnePrijave(korimeParam);
			const ponovni = await this.kdao.daj(korimeParam);

			if (ponovni && ponovni.br_neuspjesne_prijave >= 3) {
				await this.kdao.blokirajKorisnika(korimeParam);
				odgovor.status(403).json({ greska: "Račun blokiran" });
				return;
			}

			odgovor.status(401).json({ greska: "Neispravna lozinka" });
			return;
		}

		await this.kdao.resetirajPogresnePrijave(korimeParam);

		const sesija = zahtjev.session as RWASession;
		sesija.korisnik_id = korisnik.korisnik_id;
		sesija.korisnik = korisnik.korime;
		sesija.uloga = korisnik.uloga;

		odgovor.json({ poruka: "Prijava uspješna" });
	}

	async aktivacijaRacuna(zahtjev: Request, odgovor: Response) {
		const tokenParam = zahtjev.params["token"];
		if (typeof tokenParam !== "string") {
			odgovor.status(400).json({ greska: "Neispravan token" });
			return;
		}

		try {
			const podaci = jwt.verify(
				tokenParam,
				this.konf.dajKonf().jwtAktivacija
			) as unknown as { korime: string };

			await this.kdao.aktivirajKorisnika(podaci.korime);
			odgovor.json({ poruka: "Račun aktiviran" });
		} catch {
			odgovor.status(400).json({ greska: "Token nevažeći" });
		}
	}

	async odjava(zahtjev: Request, odgovor: Response) {
		zahtjev.session.destroy(() => {
			odgovor.clearCookie("sid");
			odgovor.json({ status: "Odjavljen" });
		});
	}

	putKorisnik(zahtjev: Request, odgovor: Response) {
		const korimeParam = zahtjev.params["korime"];
		if (typeof korimeParam !== "string") {
			odgovor.status(400).json({ greska: "Neispravno korime" });
			return;
		}

		const poruka = this.kdao.azuriraj(korimeParam, zahtjev.body);
		odgovor.json(poruka);
	}

	getTrenutniKorisnik(zahtjev: Request, odgovor: Response) {
		const sesija = zahtjev.session as RWASession;
		odgovor.json({
			korime: sesija.korisnik ?? null,
			uloga: sesija.uloga ?? null,
		});
	}
}
