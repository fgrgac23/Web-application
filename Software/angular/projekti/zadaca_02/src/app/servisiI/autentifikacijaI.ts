import { KorisnikI } from './korisnikI';

export interface PrijavaOdgovor {
  korisnik?: KorisnikI;
  greska?: string;
}

export interface TrenutniKorisnikOdgovor {
  korisnik?: KorisnikI;
  greska?: string;
}

export interface OdjavaOdgovor {
  poruka: string;
}
