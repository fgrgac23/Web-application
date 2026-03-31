import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Autentifikacija } from '../../servisi/autentifikacija.service';
import { Kolekcije } from '../../servisi/kolekcije.service';
import { KorisnikI } from '../../servisiI/korisnikI';
import { KolekcijaDetaljiI } from '../../servisiI/kolekcijaI';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-moderatorski-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderatorski-panel.html',
  styleUrl: './moderatorski-panel.scss',
})
export class ModeratorskiPanel implements OnInit {
  trenutni: KorisnikI | null = null;
  nemaPrava = false;

  naziv = '';
  opis = '';
  javno = false;

  kolekcije: KolekcijaDetaljiI[] = [];
  korisnici: KorisnikI[] = [];

  odabranaKolekcijaId: number | null = null;
  odabraniKorisnikId: number | null = null;
  ulogaUKolekciji: 'urednik' | 'vlasnik' = 'urednik';

  constructor(
    private auth: Autentifikacija,
    private kolekcijeServis: Kolekcije
  ) {}

  async ngOnInit(): Promise<void> {
    this.trenutni = await this.auth.trenutniKorisnik();

    if (
      this.trenutni?.uloga !== 'moderator' &&
      this.trenutni?.uloga !== 'administrator'
    ) {
      this.nemaPrava = true;
      return;
    }
    await this.ucitajPodatke();
  }

  async ucitajPodatke(): Promise<void> {
    this.kolekcije = await this.kolekcijeServis.dajKolekcijeModerator();
    this.korisnici = await this.kolekcijeServis.dajSveKorisnike();
  }

  async kreirajKolekciju(): Promise<void> {
    await this.kolekcijeServis.kreirajKolekciju({
      naziv: this.naziv,
      opis: this.opis,
      javno: this.javno ? 1 : 0,
    });

    this.naziv = '';
    this.opis = '';
    this.javno = false;

    await this.ucitajPodatke();
  }

  async dodajKorisnika(): Promise<void> {
    if (!this.odabranaKolekcijaId || !this.odabraniKorisnikId) return;

    await this.kolekcijeServis.dodajKorisnikaUKolekciju(
      this.odabranaKolekcijaId,
      this.odabraniKorisnikId,
      this.ulogaUKolekciji
    );

    await this.ucitajPodatke();
  }
}
