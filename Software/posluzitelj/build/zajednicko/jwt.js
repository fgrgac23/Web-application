import jwt from "jsonwebtoken";
console.log(jwt);
export function kreirajToken(korisnik, tajniKljucJWT) {
    const tajna = tajniKljucJWT;
    const token = jwt.sign({ korime: korisnik.korime }, tajna, {
        expiresIn: "30s",
    });
    return token;
}
export function provjeriToken(zahtjev, tajniKljucJWT) {
    if (zahtjev.headers.authorization != null) {
        const authHeader = zahtjev.headers.authorization;
        const token = authHeader.split(" ")[1] ?? "";
        try {
            const tajna = tajniKljucJWT;
            const podaci = jwt.verify(token, tajna);
            if (typeof podaci === "string") {
                return false;
            }
            return podaci;
        }
        catch {
            return false;
        }
    }
    return false;
}
export function dajToken(zahtjev) {
    return zahtjev.headers.authorization;
}
export function ispisiDijelove(token) {
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
export function dajTijelo(token) {
    const dijelovi = token.split(".");
    if (dijelovi[1] === undefined)
        return {};
    return JSON.parse(dekodirajBase64(dijelovi[1]));
}
export function dajZaglavlje(token) {
    const dijelovi = token.split(".");
    if (dijelovi[0] === undefined)
        return {};
    return JSON.parse(dekodirajBase64(dijelovi[0]));
}
function dekodirajBase64(data) {
    const buff = Buffer.from(data, "base64");
    return buff.toString("ascii");
}
//# sourceMappingURL=jwt.js.map