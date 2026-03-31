import { inject, Injectable } from '@angular/core';
import { APP_CONF, KonfiguracijaI } from './konfigurator.service';
import { FilmoviTmdbI } from '../servisiI/tmdbI';
import { SadrzajI } from '../servisiI/sadrzajI';

@Injectable({
  providedIn: 'root',
})
export class TMDB {
  private konf = inject<KonfiguracijaI>(APP_CONF);

  async pretrazi(trazi: string, stranica: number): Promise<FilmoviTmdbI> {
    const url =
      this.konf.restURL +
      `/api/tmdb/filmovi?trazi=${encodeURIComponent(
        trazi
      )}&stranica=${stranica}`;

    const odgovor = await fetch(url, {
      credentials: 'include',
    });

    if (!odgovor.ok) {
      throw new Error('Greška kod TMDB pretrage');
    }

    return (await odgovor.json()) as FilmoviTmdbI;
  }

  async dohvatiYTVideo(tmdbId: number): Promise<string | null> {
    const res = await fetch(
      this.konf.restURL + `/api/tmdb/video?id=${tmdbId}`,
      {
        credentials: 'include',
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.yt_video_id ?? null;
  }

  async dodajUBazu(sadrzaj: SadrzajI): Promise<{ sadrzaj_id: number }> {
    const odgovor = await fetch(this.konf.restURL + '/api/tmdb/dodaj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(sadrzaj),
    });

    if (!odgovor.ok) {
      throw new Error('Neuspješno dodavanje u bazu');
    }

    return (await odgovor.json()) as { sadrzaj_id: number };
  }

  async dodajUKolekciju(kolekcijaId: number, sadrzajId: number): Promise<void> {
    const odgovor = await fetch(
      this.konf.restURL + '/api/tmdb/dodajUKolekciju',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          kolekcija_id: kolekcijaId,
          sadrzaj_id: sadrzajId,
        }),
      }
    );

    if (!odgovor.ok) {
      throw new Error('Neuspješno dodavanje u kolekciju');
    }
  }
}
