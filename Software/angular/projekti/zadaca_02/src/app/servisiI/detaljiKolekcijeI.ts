export interface SadrzajI {
  naziv: string;
  url_slika: string | null;
}

export interface DetaljiKolekcijeI {
  naziv: string;
  url_slika: string | null;
  sadrzaj: SadrzajI[];
}
