import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KorisnikI } from '../../servisiI/korisnikI';
import { Autentifikacija } from '../../servisi/autentifikacija.service';
import { Admin } from '../../servisi/admin.service';

@Component({
  selector: 'app-administratorski-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administratorski-panel.html',
  styleUrl: './administratorski-panel.scss',
})
export class AdminPanel implements OnInit {
  korisnici: KorisnikI[] = [];
  trenutni: KorisnikI | null = null;

  constructor(private auth: Autentifikacija, private admin: Admin) {}

  nijeAdmin = false;

  async ngOnInit(): Promise<void> {
    this.trenutni = await this.auth.trenutniKorisnik();
    if (this.trenutni?.uloga !== 'administrator') {
      this.nijeAdmin = true;
      return;
    }
    await this.ucitaj();
  }

  async ucitaj(): Promise<void> {
    this.korisnici = await this.admin.dohvatiKorisnike();
  }

  async blokiraj(k: KorisnikI): Promise<void> {
    await this.admin.blokiraj(k.korime);
    await this.ucitaj();
  }

  async odblokiraj(k: KorisnikI): Promise<void> {
    await this.admin.odblokiraj(k.korime);
    await this.ucitaj();
  }

  async postaviModerator(k: KorisnikI): Promise<void> {
    await this.admin.postaviUlogu(k.korime, 'moderator');
    await this.ucitaj();
  }

  async postaviKorisnik(k: KorisnikI): Promise<void> {
    await this.admin.postaviUlogu(k.korime, 'korisnik');
    await this.ucitaj();
  }
}
