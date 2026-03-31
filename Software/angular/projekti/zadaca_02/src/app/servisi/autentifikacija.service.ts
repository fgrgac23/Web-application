import { inject, Injectable } from '@angular/core';
import { APP_CONF, KonfiguracijaI } from './konfigurator.service';
import {
  PrijavaOdgovor,
  OdjavaOdgovor,
} from '../servisiI/autentifikacijaI';
import {
  RegistracijaZahtjev,
  RegistracijaOdgovor,
} from '../servisiI/registracijaI';
import { KorisnikI } from '../servisiI/korisnikI';

@Injectable({
  providedIn: 'root',
})
export class Autentifikacija {
  private konf = inject<KonfiguracijaI>(APP_CONF);

  async prijava(korime: string, lozinka: string): Promise<PrijavaOdgovor> {
    const url =
      this.konf.restURL +
      '/api/korisnici/prijava/' +
      encodeURIComponent(korime);

    const odgovor = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ lozinka }),
    });

    return (await odgovor.json()) as PrijavaOdgovor;
  }

  async trenutniKorisnik(): Promise<KorisnikI | null> {
    const url = this.konf.restURL + '/api/korisnik/trenutni';

    const odgovor = await fetch(url, {
      credentials: 'include',
    });

    const data = await odgovor.json();

    if (data && data.korime) {
      return data as KorisnikI;
    }

    return null;
  }

  async odjava(): Promise<OdjavaOdgovor> {
    const url = this.konf.restURL + '/api/korisnici/odjava';

    const odgovor = await fetch(url, {
      method: 'POST',
      credentials: 'include',
    });

    return (await odgovor.json()) as OdjavaOdgovor;
  }

  async registracija(
    podaci: RegistracijaZahtjev
  ): Promise<RegistracijaOdgovor> {
    const url = this.konf.restURL + '/api/korisnici';

    const odgovor = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(podaci),
    });

    return (await odgovor.json()) as RegistracijaOdgovor;
  }
}
