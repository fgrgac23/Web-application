import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TMDB } from '../../servisi/tmdb.service';
import { KorisnikI } from '../../servisiI/korisnikI';
import { Autentifikacija } from '../../servisi/autentifikacija.service';
import { FilmTmdbI } from '../../servisiI/tmdbI';
import { KolekcijaI } from '../../servisiI/kolekcijaI';
import { Kolekcije } from '../../servisi/kolekcije.service';
import { SadrzajI } from '../../servisiI/sadrzajI';

@Component({
  selector: 'app-sadrzaj',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sadrzaj.html',
  styleUrl: './sadrzaj.scss',
})
export class Sadrzaj {
  trenutni: KorisnikI | null = null;
  nemaPrava = false;

  pojam = '';
  stranica = 1;
  ukupnoStranica = 1;

  filmovi: FilmTmdbI[] = [];
  poruka = '';

  kolekcije: KolekcijaI[] = [];
  odabranaKolekcijaId: number | null = null;

  constructor(
    private tmdb: TMDB,
    private auth: Autentifikacija,
    private kolekcijeServis: Kolekcije
  ) {}

  async ngOnInit(): Promise<void> {
    this.trenutni = await this.auth.trenutniKorisnik();
    this.kolekcije = await this.kolekcijeServis.dajMojeKolekcije();

    if (!this.trenutni) {
      this.nemaPrava = true;
      return;
    }
    await this.pretrazi();
  }

  async pretrazi(): Promise<void> {
    if (this.pojam.trim().length === 0) {
      this.filmovi = [];
      return;
    }

    try {
      const odgovor = await this.tmdb.pretrazi(this.pojam, this.stranica);
      this.filmovi = odgovor.results;
      this.ukupnoStranica = odgovor.total_pages;
      this.poruka = '';
    } catch {
      this.filmovi = [];
      this.poruka = 'Greška pri dohvaćanju filmova';
    }
  }

  async sljedeca(): Promise<void> {
    if (this.stranica < this.ukupnoStranica) {
      this.stranica++;
      await this.pretrazi();
    }
  }

  async prethodna(): Promise<void> {
    if (this.stranica > 1) {
      this.stranica--;
      await this.pretrazi();
    }
  }

  private async mapirajUSadrzaj(f: FilmTmdbI): Promise<SadrzajI> {
    const ytId = await this.tmdb.dohvatiYTVideo(f.id);
    return {
      naziv: f.original_title || f.title,
      autor: 'tmdb',
      datum: f.release_date,
      putanja: f.poster_path
        ? 'https://image.tmdb.org/t/p/w500' + f.poster_path
        : '',
      vrsta: 'film',
      naslov: f.title,
      izvor: f.overview,
      javno: 1,
      velicina: 0,
      yt_video_id: ytId,
      tmdb_id: f.id,
    };
  }

  async dodajUKolekciju(film: FilmTmdbI): Promise<void> {
    if (!this.odabranaKolekcijaId) {
      this.poruka = 'Morate odabrati kolekciju!';
      return;
    }

    const sadrzaj = await this.mapirajUSadrzaj(film);

    const rezultat = await this.tmdb.dodajUBazu(sadrzaj);

    await this.tmdb.dodajUKolekciju(
      this.odabranaKolekcijaId,
      rezultat.sadrzaj_id
    );

    this.poruka = 'Sadržaj dodan u kolekciju!';
  }
}
