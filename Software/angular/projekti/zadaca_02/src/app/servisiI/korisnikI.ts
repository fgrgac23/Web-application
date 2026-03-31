export interface KorisnikI {
  korisnik_id: number;
  ime: string;
  prezime: string;
  korime: string;
  email: string;
  uloga: string;
  blokiran: number;
  drzava: string | null;
  grad: string | null;
  opis: string | null;
  kreiran: string | null;
}
