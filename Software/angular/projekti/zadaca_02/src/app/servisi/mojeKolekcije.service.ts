import { inject, Injectable } from '@angular/core';
import { APP_CONF, KonfiguracijaI } from './konfigurator.service';
import { KolekcijaI } from '../servisiI/kolekcijaI';
import { SadrzajI } from '../servisiI/sadrzajI';

@Injectable({ providedIn: 'root' })
export class MojeKolekcijeServis {
  private konf = inject<KonfiguracijaI>(APP_CONF);

  async dohvatiMojeKolekcije(): Promise<KolekcijaI[]> {
    const r = await fetch(this.konf.restURL + '/api/kolekcije/moje', {
      credentials: 'include',
    });
    return (await r.json()) as KolekcijaI[];
  }

  async dohvatiSadrzaj(kolekcijaId: number): Promise<SadrzajI[]> {
    const r = await fetch(
      `${this.konf.restURL}/api/kolekcije/${kolekcijaId}/sadrzaj`,
      { credentials: 'include' }
    );
    return (await r.json()) as SadrzajI[];
  }

  async promijeniJavnostKolekcije(id: number, javno: number): Promise<void> {
    await fetch(`${this.konf.restURL}/api/kolekcije/${id}/javno`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ javno }),
    });
  }

  async promijeniVidljivostSadrzaja(id: number, javno: number): Promise<void> {
    await fetch(`${this.konf.restURL}/api/tmdb/sadrzaj/${id}/vidljivost`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ javno }),
    });
  }

  async postaviNaslovnuSliku(
    kolekcijaId: number,
    sadrzajId: number
  ): Promise<void> {
    await fetch(`${this.konf.restURL}/api/kolekcije/${kolekcijaId}/slika`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ sadrzaj_id: sadrzajId }),
    });
  }
}
