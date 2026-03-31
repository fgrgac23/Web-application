import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Request } from "express";

console.log(jwt);

export function kreirajToken(
	korisnik: { korime: string },
	tajniKljucJWT: string
): string {
	const tajna: Secret = tajniKljucJWT;

	const token = jwt.sign({ korime: korisnik.korime }, tajna, {
		expiresIn: "30s",
	});

	return token;
}

export function provjeriToken(
	zahtjev: Request,
	tajniKljucJWT: string
): JwtPayload | false {
	if (zahtjev.headers.authorization != null) {
		const authHeader = zahtjev.headers.authorization;
		const token = authHeader.split(" ")[1] ?? "";

		try {
			const tajna: Secret = tajniKljucJWT;
			const podaci = jwt.verify(token, tajna);

			if (typeof podaci === "string") {
				return false;
			}

			return podaci;
		} catch {
			return false;
		}
	}
	return false;
}

export function dajToken(zahtjev: Request): string | undefined {
	return zahtjev.headers.authorization;
}

export function ispisiDijelove(token: string): void {
	const dijelovi = token.split(".");

	if (dijelovi[0] !== undefined) {
		const zaglavlje = dekodirajBase64(dijelovi[0]);
		console.log(zaglavlje);
	}
	if (dijelovi[1] !== undefined) {
		const tijelo = dekodirajBase64(dijelovi[1]);
		console.log(tijelo);
	}
	if (dijelovi[2] !== undefined) {
		const potpis = dekodirajBase64(dijelovi[2]);
		console.log(potpis);
	}
}

export function dajTijelo(token: string): JwtPayload | {} {
	const dijelovi = token.split(".");
	if (dijelovi[1] === undefined) return {};

	return JSON.parse(dekodirajBase64(dijelovi[1])) as JwtPayload;
}

export function dajZaglavlje(token: string): JwtPayload | {} {
	const dijelovi = token.split(".");
	if (dijelovi[0] === undefined) return {};

	return JSON.parse(dekodirajBase64(dijelovi[0])) as JwtPayload;
}

function dekodirajBase64(data: string): string {
	const buff = Buffer.from(data, "base64");
	return buff.toString("ascii");
}
