import { Injectable, InjectionToken } from '@angular/core';

export interface KonfiguracijaI {
  restURL: string;
}

export const APP_CONF = new InjectionToken<KonfiguracijaI>('APP_CONF');

@Injectable({
  providedIn: 'root',
})
export class KonfiguratorServis {
  private konf!: KonfiguracijaI;

  async ucitaj(): Promise<void> {
    const odgovor = await fetch('/config.json');
    this.konf = await odgovor.json();
  }

  dajKonf(): KonfiguracijaI {
    return this.konf;
  }
}
