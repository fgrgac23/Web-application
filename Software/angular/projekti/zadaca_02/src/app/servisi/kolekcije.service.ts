import { inject, Injectable } from '@angular/core';
import { KolekcijaDetaljiI, KolekcijaI } from '../servisiI/kolekcijaI';
import {
  APP_CONF,
  KonfiguracijaI,
} from './konfigurator.service';
import { KorisnikI } from '../servisiI/korisnikI';
import { SadrzajI } from '../servisiI/sadrzajI';

@Injectable({
  providedIn: 'root',
})
export class Kolekcije {
  konf = inject<KonfiguracijaI>(APP_CONF);

  async dohvatiDetalje(id: number) {
    const url = this.konf.restURL + '/api/kolekcije/' + id + '/sadrzaj/javno';
    let odgovor = await fetch(url);
    return await odgovor.json();
  }

  async dajKolekcijeModerator(): Promise<KolekcijaDetaljiI[]> {
    const odgovor = await fetch(this.konf.restURL + '/api/kolekcije', {
      credentials: 'include',
    });
    return (await odgovor.json()) as KolekcijaDetaljiI[];
  }

  async dajSveKorisnike(): Promise<KorisnikI[]> {
    const odgovor = await fetch(this.konf.restURL + '/api/korisnici', {
      credentials: 'include',
    });
    return (await odgovor.json()) as KorisnikI[];
  }

  async kreirajKolekciju(podaci: {
    naziv: string;
    opis: string | null;
    javno: number;
  }): Promise<void> {
    await fetch(this.konf.restURL + '/api/kolekcije', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(podaci),
    });
  }

  async dodajKorisnikaUKolekciju(
    kolekcijaId: number,
    korisnikId: number,
    uloga: 'vlasnik' | 'urednik'
  ): Promise<void> {
    await fetch(this.konf.restURL + `/api/kolekcije/${kolekcijaId}/korisnici`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        korisnik_id: korisnikId,
        uloga,
      }),
    });
  }

  async dajSadrzajKolekcije(id: number) {
    const odgovor = await fetch(
      this.konf.restURL + `/api/kolekcije/${id}/sadrzaj`,
      { credentials: 'include' }
    );
    return await odgovor.json();
  }

  async dajJavniSadrzajKolekcije(id: number) {
    const odgovor = await fetch(
      this.konf.restURL + `/api/kolekcije/${id}/sadrzaj/javno`
    );
    return await odgovor.json();
  }

  async dohvatiJavne(): Promise<KolekcijaI[]> {
    const r = await fetch(this.konf.restURL + '/api/kolekcije/javne');
    return r.json();
  }

  async dajMojeKolekcije(): Promise<KolekcijaI[]> {
    const r = await fetch(this.konf.restURL + '/api/kolekcije/moje', {
      credentials: 'include',
    });
    return r.json();
  }

  async dohvatiDetaljeJavno(id: number): Promise<SadrzajI[]> {
    const r = await fetch(
      this.konf.restURL + `/api/kolekcije/${id}/sadrzaj/javno`
    );
    return r.json();
  }

  async dohvatiDetaljePrivatno(id: number): Promise<SadrzajI[]> {
    const r = await fetch(this.konf.restURL + `/api/kolekcije/${id}/sadrzaj`, {
      credentials: 'include',
    });
    return r.json();
  }

  async promijeniJavnostKolekcije(
    kolekcijaId: number,
    javno: number
  ): Promise<void> {
    await fetch(this.konf.restURL + `/api/kolekcije/${kolekcijaId}/javno`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ javno }),
    });
  }

  async promijeniVidljivostSadrzaja(
    sadrzajId: number,
    javno: number
  ): Promise<void> {
    await fetch(
      this.konf.restURL + `/api/tmdb/sadrzaj/${sadrzajId}/vidljivost`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ javno }),
      }
    );
  }

  async postaviNaslovnuSliku(
    kolekcijaId: number,
    putanja: string
  ): Promise<void> {
    await fetch(this.konf.restURL + `/api/kolekcije/${kolekcijaId}/slika`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ putanja }),
    });
  }

  async obrisiSadrzajIzKolekcije(
    kolekcijaId: number,
    sadrzajId: number
  ): Promise<void> {
    const r = await fetch(
      `${this.konf.restURL}/api/kolekcije/${kolekcijaId}/sadrzaj/${sadrzajId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    if (!r.ok) {
      throw new Error('Greška pri brisanju sadržaja iz kolekcije');
    }
  }

  async pretraziJavniSadrzaj(
    kolekcijaId: number,
    pojam: string
  ): Promise<SadrzajI[]> {
    if (pojam.trim().length < 3) {
      return [];
    }

    const res = await fetch(
      `/api/kolekcije/${kolekcijaId}/sadrzaj/javno?q=${encodeURIComponent(
        pojam
      )}`
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  }
}
