import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Kolekcije } from '../../servisi/kolekcije.service';
import { Autentifikacija } from '../../servisi/autentifikacija.service';
import { SadrzajI } from '../../servisiI/sadrzajI';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type IzvorPrikaza = 'javna' | 'moja';

@Component({
  standalone: true,
  selector: 'app-detalji-kolekcije',
  imports: [CommonModule, FormsModule],
  templateUrl: './detalji-kolekcije.html',
  styleUrl: './detalji-kolekcije.scss',
})
export class DetaljiKolekcije implements OnInit {
  kolekcijaId!: number;
  sadrzaj: SadrzajI[] = [];
  jeVlasnik = false;
  iz: IzvorPrikaza = 'javna';

  constructor(
    private route: ActivatedRoute,
    private servis: Kolekcije,
    private auth: Autentifikacija,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit(): Promise<void> {
    this.kolekcijaId = Number(this.route.snapshot.paramMap.get('id'));
    const izParam = this.route.snapshot.queryParamMap.get('iz');
    this.iz = izParam === 'moja' ? 'moja' : 'javna';

    if (this.iz === 'javna') {
      this.jeVlasnik = false;
      this.sadrzaj = await this.servis.dohvatiDetaljeJavno(this.kolekcijaId);
      return;
    }

    const korisnik = await this.auth.trenutniKorisnik();
    if (!korisnik) {
      this.jeVlasnik = false;
      this.sadrzaj = await this.servis.dohvatiDetaljeJavno(this.kolekcijaId);
      return;
    }

    this.jeVlasnik = true;
    this.sadrzaj = await this.servis.dohvatiDetaljePrivatno(this.kolekcijaId);
  }

  ytEmbedUrl(ytId: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${ytId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async promijeniVidljivost(s: SadrzajI, nova: number): Promise<void> {
    if (!this.jeVlasnik || !s.sadrzaj_id) return;
    if (s.javno === nova) return;

    s.javno = nova;
    await this.servis.promijeniVidljivostSadrzaja(s.sadrzaj_id, nova);
  }

  async postaviNaslovnu(s: SadrzajI): Promise<void> {
    if (!this.jeVlasnik) return;
    await this.servis.postaviNaslovnuSliku(this.kolekcijaId, s.putanja);
  }

  async obrisiSadrzaj(s: SadrzajI): Promise<void> {
    if (!s.sadrzaj_id) return;

    const potvrda = confirm(
      'Jeste li sigurni da želite obrisati sadržaj iz kolekcije?'
    );
    if (!potvrda) return;

    await this.servis.obrisiSadrzajIzKolekcije(this.kolekcijaId, s.sadrzaj_id);

    this.sadrzaj = this.sadrzaj.filter((x) => x.sadrzaj_id !== s.sadrzaj_id);
  }
}
