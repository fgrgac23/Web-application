export class TMDBklijent {
    bazicniURL = "https://api.themoviedb.org/3";
    apiKljuc;
    constructor(apiKljuc) {
        this.apiKljuc = apiKljuc;
    }
    async dohvatiZanrove() {
        let resurs = "/genre/movie/list";
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor).genres;
    }
    async dohvatiFilm(id) {
        let resurs = "/movie/" + id;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor);
    }
    async pretraziFilmovePoNazivu(trazi, stranica) {
        let resurs = "/search/movie";
        let parametri = {
            sort_by: "popularity.desc",
            include_adult: false,
            page: stranica,
            query: trazi,
        };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor);
    }
    async obaviZahtjev(resurs, parametri = {}) {
        let zahtjev = this.bazicniURL + resurs + "?api_key=" + this.apiKljuc;
        for (let p in parametri) {
            zahtjev += "&" + p + "=" + parametri[p];
        }
        console.log(zahtjev);
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }
    async dohvatiSlike(id) {
        const odgovor = await this.obaviZahtjev(`/movie/${id}/images`);
        return JSON.parse(odgovor);
    }
    async dohvatiVideo(tmdbId) {
        const odgovor = await this.obaviZahtjev(`/movie/${tmdbId}/videos`);
        const podaci = JSON.parse(odgovor);
        if (!podaci.results || podaci.results.length === 0) {
            return null;
        }
        const trailer = podaci.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
        return trailer ? trailer.key : null;
    }
}
//# sourceMappingURL=tmdbDAO.js.map