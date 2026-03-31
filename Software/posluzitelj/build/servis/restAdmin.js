import { KorisnikDAO } from "./korisnikDAO.js";
export class RestAdmin {
    dao = new KorisnikDAO();
    provjeriAdmina(zahtjev, odgovor) {
        const sesija = zahtjev.session;
        if (!sesija.korisnik) {
            odgovor.status(401).json({ greska: "Neautoriziran pristup" });
            return false;
        }
        if (sesija.uloga !== "administrator") {
            odgovor.status(403).json({ greska: "Zabranjen pristup. Niste admin" });
            return false;
        }
        return true;
    }
    async getKorisnici(zahtjev, odgovor) {
        if (!this.provjeriAdmina(zahtjev, odgovor))
            return;
        const lista = await this.dao.dajSve();
        odgovor.json(lista);
    }
    async blokiraj(zahtjev, odgovor) {
        if (!this.provjeriAdmina(zahtjev, odgovor))
            return;
        const korimeParam = zahtjev.params["korime"];
        if (typeof korimeParam !== "string") {
            odgovor.status(400).json({ greska: "Neispravan korime" });
            return;
        }
        const sesija = zahtjev.session;
        if (korimeParam === sesija.korisnik) {
            odgovor
                .status(409)
                .json({ greska: "Korisnik ne može blokirati samog sebe!" });
            return;
        }
        await this.dao.blokiranjeKorisnika(korimeParam);
        odgovor.json({ poruka: "Korisnik blokiran." });
    }
    async odblokirajKorisnika(zahtjev, odgovor) {
        if (!this.provjeriAdmina(zahtjev, odgovor))
            return;
        const korimeParam = zahtjev.params["korime"];
        if (typeof korimeParam !== "string") {
            odgovor.status(400).json({ greska: "Neispravan korime" });
            return;
        }
        await this.dao.odblokirajKorisnika(korimeParam);
        await this.dao.resetirajPogresnePrijave(korimeParam);
        odgovor.json({ poruka: "Korisnik je odblokiran." });
    }
    async promjeniUlogu(zahtjev, odgovor) {
        if (!this.provjeriAdmina(zahtjev, odgovor))
            return;
        const korimeParam = zahtjev.params["korime"];
        if (typeof korimeParam !== "string") {
            odgovor.status(400).json({ greska: "Neispravan korime" });
            return;
        }
        const uloga = zahtjev.body.uloga;
        await this.dao.postaviUloguKorisnika(korimeParam, uloga);
        odgovor.json({ poruka: "Postavljena nova uloga." });
    }
}
//# sourceMappingURL=restAdmin.js.map