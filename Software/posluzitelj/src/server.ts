import cors from "cors";
import express, { Application } from "express";
import path from "path";
import { dajPort } from "./zajednicko/esmPomocnik.js";
import { Konfiguracija } from "./zajednicko/konfiguracija.js";
import {
	pripremiPutanjeResursTMDB,
	pripremiPutanjeResursKorisnika,
} from "./servis/servis.js";
import sesija from "express-session";
import kolacici from "cookie-parser";

main(process.argv);

async function main(argv: Array<string>) {
	let port: number = dajPort("fgrgac23");
	if (argv[3] != undefined) {
		port = parseInt(argv[3]);
	}

	let konf: Konfiguracija | null = null;
	try {
		konf = await inicjalizirajKonfiguraciju();
	} catch (greska: Error | any) {
		if (process.argv.length == 2)
			console.error("Potrebno je dati naziv datoteke");
		else if (greska.path != undefined)
			console.error("Nije moguće otvoriti datoteku: " + greska.path);
		else console.log(greska.message);
		process.exit();
	}

	const server: Application = express();

	inicjalizirajPostavkeServera(server, konf);
	pripremiPutanjeServera(server, konf, port);
	pokreniServer(server, port);
}

function inicjalizirajPostavkeServera(
	server: Application,
	konf: Konfiguracija
) {
	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));
	server.use(
		cors({
			origin: (origin, povratniPoziv) => {
				if (
					!origin ||
					origin.startsWith("http://spider.foi.hr:") ||
					origin.startsWith("http://localhost:")
				) {
					povratniPoziv(null, true);
				} else {
					povratniPoziv(new Error("Nije dozvoljeno zbog CORS"));
				}
			},
			credentials: true,
			optionsSuccessStatus: 200,
		})
	);
	server.use(kolacici());
	server.use(
		sesija({
			secret: konf.dajKonf().tajniKljucSesija,
			saveUninitialized: true,
			cookie: { maxAge: 1000 * 60 * 60 * 3 },
			resave: false,
		})
	);
}

function pripremiPutanjeServera(
	server: Application,
	konf: Konfiguracija,
	port: number
) {
	pripremiPutanjeResursKorisnika(server, konf);
	pripremiPutanjeResursTMDB(server, konf);

	const angularPath = path.join(process.cwd(), "angular", "browser");
	server.use(express.static(angularPath));

	server.get(/^\/(?!api).*/, (zahtjev, odgovor) => {
		odgovor.sendFile(path.join(angularPath, "index.html"));
	});
}

async function inicjalizirajKonfiguraciju(): Promise<Konfiguracija> {
	let konf = new Konfiguracija();
	await konf.ucitajKonfiguraciju();
	return konf;
}

function pokreniServer(server: Application, port: number) {
	server.listen(port, () => {
		console.log(`Server pokrenut na portu: ${port}`);
	});
}
