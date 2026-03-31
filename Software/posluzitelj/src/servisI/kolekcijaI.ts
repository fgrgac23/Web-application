export interface KolekcijaI {
	naziv: string;
	opis: string | null;
	javno: number;
	url_slika: string;
}

export interface KorisnikKolekcijeI {
	korisnik_id: number;
	korime: string;
	uloga_kolekcije: "vlasnik" | "urednik";
}

export interface KolekcijaDetaljiI {
	kolekcija_id: number;
	naziv: string;
	opis: string | null;
	javno: number;
	vlasnik: string | null;
	korisnici: KorisnikKolekcijeI[];
}
