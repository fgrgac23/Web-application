import { Session } from "express-session";

export interface KorisnikI {
	korisnik_id: number;
	ime: string;
	prezime: string;
	korime: string;
	lozinka: string;
	sol: string;
	email: string;
	uloga: string;
	blokiran: number;
	br_neuspjesne_prijave: number;
	drzava: string | null;
	grad: string | null;
	opis: string | null;
	kreiran: string | null;
	aktiviran: number;
}

export interface RWASession extends Session {
	korisnik_id: number;
	korisnik: string | null;
	uloga: string;
}
