import { inject, Injectable } from '@angular/core';
import { APP_CONF, KonfiguracijaI } from './konfigurator.service';
import { JavniSadrzajI } from '../servisiI/sadrzajI';

@Injectable({ providedIn: 'root' })
export class JavniSadrzajServis {
  private konf = inject<KonfiguracijaI>(APP_CONF);

  async dohvati(trazi: string = ''): Promise<JavniSadrzajI[]> {
    const q = trazi.trim();

    const url =
      q.length > 0
        ? `${this.konf.restURL}/api/sadrzaj/javno?trazi=${encodeURIComponent(
            q
          )}`
        : `${this.konf.restURL}/api/sadrzaj/javno`;

    const r = await fetch(url, { credentials: 'include' });

    if (!r.ok) {
      const tekst = await r.text();
      throw new Error(tekst || 'Greška pri dohvaćanju javnog sadržaja');
    }

    return (await r.json()) as JavniSadrzajI[];
  }

  async filtriraj(
    autor: string | null,
    datumOd: string | null,
    datumDo: string | null
  ): Promise<JavniSadrzajI[]> {
    const params = new URLSearchParams();

    if (autor) params.append('autor', autor);
    if (datumOd) params.append('datumOd', datumOd);
    if (datumDo) params.append('datumDo', datumDo);

    const r = await fetch(
      `${this.konf.restURL}/api/sadrzaj/javno/filter?${params.toString()}`,
      { credentials: 'include' }
    );

    if (!r.ok) {
      throw new Error('Greška pri filtriranju javnog sadržaja');
    }

    return (await r.json()) as JavniSadrzajI[];
  }
}
