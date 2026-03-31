export interface SadrzajI {
  sadrzaj_id?: number;
  naziv: string;
  autor: string;
  putanja: string;
  vrsta: string;
  naslov: string;
  izvor: string;
  javno: number;
  datum: string;
  velicina: number;
  yt_video_id?: string | null;
  tmdb_id?: number;
}

export interface JavniSadrzajI {
  sadrzaj_id: number;
  naslov: string;
  putanja: string;
  autor: string;
  vrsta: string;
  opis: string;
  datum: string;
}
