import { RestKorisnik } from "./restKorisnik.js";
import { RestKolekcija } from "./restKolekcija.js";
import { Konfiguracija } from "../zajednicko/konfiguracija.js";
import { Application } from "express";
import { RestAdmin } from "./restAdmin.js";
import { RestTMDB } from "./restTMDB.js";

export function pripremiPutanjeResursTMDB(
	server: Application,
	konf: Konfiguracija
) {
	let restTMDB = new RestTMDB(konf.dajKonf()["tmdbApiKeyV3"]);
	server.get("/api/tmdb/filmovi", restTMDB.getFilmovi.bind(restTMDB));

	server.get("/api/tmdb/slike", restTMDB.getSlike.bind(restTMDB));

	server.post("/api/tmdb/dodaj", restTMDB.dodajSadrzaj.bind(restTMDB));

	server.post(
		"/api/tmdb/dodajUKolekciju",
		restTMDB.dodajSadrzajUKolekciju.bind(restTMDB)
	);

	server.put(
		"/api/tmdb/sadrzaj/:id/vidljivost",
		restTMDB.promjeniVidljivost.bind(restTMDB)
	);

	server.get("/api/tmdb/video", restTMDB.getVideo.bind(restTMDB));

	server.delete(
		"/api/kolekcije/:id/sadrzaj/:sid",
		restTMDB.obrisiSadrzajIzKolekcije.bind(restTMDB)
	);
}

export function pripremiPutanjeResursKorisnika(
	server: Application,
	konf: Konfiguracija
) {
	let restKorisnik = new RestKorisnik(konf);
	let restKolekcija = new RestKolekcija();
	let restAdmin = new RestAdmin();
	server.get("/api/korisnici", restKorisnik.getKorisnici.bind(restKorisnik));
	server.post("/api/korisnici", restKorisnik.postKorisnici.bind(restKorisnik));

	server.get(
		"/api/korisnici/:korime",
		restKorisnik.getKorisnik.bind(restKorisnik)
	);
	server.post(
		"/api/korisnici/prijava/:korime",
		restKorisnik.getKorisnikPrijava.bind(restKorisnik)
	);

	server.get(
		"/api/korisnik/trenutni",
		restKorisnik.getTrenutniKorisnik.bind(restKorisnik)
	);

	server.post("/api/korisnici/odjava", restKorisnik.odjava.bind(restKorisnik));

	server.put(
		"/api/korisnici/:korime",
		restKorisnik.putKorisnik.bind(restKorisnik)
	);
	server.get(
		"/api/kolekcije/javne",
		restKolekcija.dajJavne.bind(restKolekcija)
	);

	server.get("/api/admin/korisnici", restAdmin.getKorisnici.bind(restAdmin));
	server.put(
		"/api/admin/korisnici/:korime/blokiraj",
		restAdmin.blokiraj.bind(restAdmin)
	);
	server.put(
		"/api/admin/korisnici/:korime/odblokiraj",
		restAdmin.odblokirajKorisnika.bind(restAdmin)
	);
	server.put(
		"/api/admin/korisnici/:korime/uloga",
		restAdmin.promjeniUlogu.bind(restAdmin)
	);

	server.post(
		"/api/kolekcije",
		restKolekcija.kreirajKolekciju.bind(restKolekcija)
	);
	server.post(
		"/api/kolekcije/:id/korisnici",
		restKolekcija.dodajKorisnika.bind(restKolekcija)
	);
	server.get(
		"/api/kolekcije",
		restKolekcija.dajKolekcijeModerator.bind(restKolekcija)
	);

	server.get(
		"/api/kolekcije/moje",
		restKolekcija.dajMojeKolekcije.bind(restKolekcija)
	);

	server.get(
		"/api/kolekcije/:id/sadrzaj",
		restKolekcija.dajsadrzajKolekcije.bind(restKolekcija)
	);

	server.get(
		"/api/kolekcije/:id/sadrzaj/javno",
		restKolekcija.dajjavnisadrzajKolekcije.bind(restKolekcija)
	);

	server.put(
		"/api/kolekcije/:id/javno",
		restKolekcija.promjenaJavnostiKolekcije.bind(restKolekcija)
	);
	server.put(
		"/api/kolekcije/:id/slika",
		restKolekcija.postaviIstaknutuSliku.bind(restKolekcija)
	);

	server.get(
		"/api/korisnik/aktivacija/:token",
		restKorisnik.aktivacijaRacuna.bind(restKorisnik)
	);

	server.get(
		"/api/sadrzaj/javno",
		restKolekcija.dohvatiJavniSadrzaj.bind(restKolekcija)
	);

	server.get(
		"/api/sadrzaj/javno/filter",
		restKolekcija.filtrirajSadrzaj.bind(restKolekcija)
	);
}
