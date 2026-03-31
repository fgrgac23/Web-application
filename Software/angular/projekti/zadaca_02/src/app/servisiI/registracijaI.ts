export interface RegistracijaZahtjev {
  ime: string;
  prezime: string;
  korime: string;
  lozinka: string;
  email: string;
  drzava: string | null;
  grad: string | null;
  opis: string | null;
}

export interface RegistracijaOdgovor {
  poruka?: string;
  greska?: string;
}
