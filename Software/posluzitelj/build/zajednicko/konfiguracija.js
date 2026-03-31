import dsPromise from "fs/promises";
export class Konfiguracija {
    konf;
    constructor() {
        this.konf = this.initKonf();
    }
    initKonf() {
        return {
            tajniKljucSesija: "",
            stranicaLimit: "",
            tmdbApiKeyV3: "",
            tmdbApiKeyV4: "",
            jwtAktivacija: "",
            smtpHost: "",
            smtpPort: "",
            smtpUser: "",
            smtpPass: "",
        };
    }
    dajKonf() {
        return this.konf;
    }
    async ucitajKonfiguraciju() {
        console.log(this.konf);
        let nazivDatoteke = process.argv[2];
        if (nazivDatoteke == undefined || nazivDatoteke.trim() === "") {
            nazivDatoteke = "konfiguracija.csv";
        }
        let putanja = "podaci/" + nazivDatoteke;
        var podaci = await dsPromise.readFile(putanja, {
            encoding: "utf-8",
        });
        this.ucitajConfKonfiguraciju(podaci);
        console.log(this.konf);
        this.provjeriPodatkeKonfiguracije();
    }
    ucitajConfKonfiguraciju(podaci) {
        console.log(podaci);
        let konf = {};
        var nizPodataka = podaci.split("\n");
        for (let podatak of nizPodataka) {
            podatak = podatak.trim();
            if (podatak.length === 0)
                continue;
            if (!podatak.includes("$"))
                throw new Error("Neispravan format, nedostaje $: " + podatak);
            const [naziv, vrijednost] = podatak.split("$");
            if (!naziv || !vrijednost)
                throw new Error("Neispravan zapis u konfiguracijskoj datoteci: " + podatak);
            konf[naziv] = vrijednost.trim();
        }
        this.konf = konf;
    }
    provjeriPodatkeKonfiguracije() {
        if (this.konf.tajniKljucSesija == undefined ||
            this.konf.tajniKljucSesija.trim() == "" ||
            this.konf.tajniKljucSesija.length < 100 ||
            this.konf.tajniKljucSesija.length > 200) {
            throw new Error("Tajni ključ sesije mora sadržavati između 100 i 200 znakova.");
        }
        if (this.konf.tajniKljucSesija.includes("$")) {
            throw new Error("Tajni ključ sesije ne smije sadržavati znak $.");
        }
        if (Number(this.konf.stranicaLimit) < 10 ||
            Number(this.konf.stranicaLimit) > 50) {
            throw new Error("StranicaLimit mora biti broj između 10 i 50");
        }
        if (this.konf.tmdbApiKeyV3 == undefined ||
            this.konf.tmdbApiKeyV3.trim() == "" ||
            this.konf.tmdbApiKeyV3.length < 10) {
            throw new Error("TMDB API ključ nije dobar u tmdbApiKeyV3");
        }
        if (this.konf.tmdbApiKeyV4 == undefined ||
            this.konf.tmdbApiKeyV4.trim() == "" ||
            this.konf.tmdbApiKeyV3.length < 20) {
            throw new Error("TMDB API ključ nije dobar u tmdbApiKeyV4");
        }
    }
}
//# sourceMappingURL=konfiguracija.js.map