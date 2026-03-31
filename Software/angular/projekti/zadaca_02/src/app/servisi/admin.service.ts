import { inject, Injectable } from '@angular/core';
import { APP_CONF, KonfiguracijaI } from './konfigurator.service';
import { KorisnikI } from '../servisiI/korisnikI';

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private konf = inject<KonfiguracijaI>(APP_CONF);

  async dohvatiKorisnike(): Promise<KorisnikI[]> {
    const odgovor = await fetch(this.konf.restURL + '/api/admin/korisnici', {
      credentials: 'include',
    });

    if (!odgovor.ok) {
      return [];
    }

    return (await odgovor.json()) as KorisnikI[];
  }

  async blokiraj(korime: string): Promise<void> {
    await fetch(
      this.konf.restURL +
        `/api/admin/korisnici/${encodeURIComponent(korime)}/blokiraj`,
      {
        method: 'PUT',
        credentials: 'include',
      }
    );
  }

  async odblokiraj(korime: string): Promise<void> {
    await fetch(
      this.konf.restURL +
        `/api/admin/korisnici/${encodeURIComponent(korime)}/odblokiraj`,
      {
        method: 'PUT',
        credentials: 'include',
      }
    );
  }

  async postaviUlogu(korime: string, uloga: string): Promise<void> {
    await fetch(
      this.konf.restURL +
        `/api/admin/korisnici/${encodeURIComponent(korime)}/uloga`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ uloga }),
      }
    );
  }
}
