import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Kolekcije } from '../../servisi/kolekcije.service';
import { KolekcijaI } from '../../servisiI/kolekcijaI';
import { FormsModule } from '@angular/forms';
import { Autentifikacija } from '../../servisi/autentifikacija.service';

@Component({
  standalone: true,
  selector: 'app-moje-kolekcije',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './moje-kolekcije.html',
  styleUrl: './moje-kolekcije.scss',
})
export class MojeKolekcije implements OnInit {
  kolekcije: KolekcijaI[] = [];
  poruka = '';

  constructor(private servis: Kolekcije, private auth: Autentifikacija,) {}

  async ngOnInit(): Promise<void> {
    const korisnik = await this.auth.trenutniKorisnik();
    if (!korisnik) {
      this.poruka = 'Morate biti prijavljeni.';
      return;
    }

    this.kolekcije = await this.servis.dajMojeKolekcije();
  }

  async promijeniVidljivostKolekcije(
    k: KolekcijaI,
    nova: number
  ): Promise<void> {
    if (k.javno === nova) return;

    k.javno = nova;
    await this.servis.promijeniJavnostKolekcije(k.kolekcija_id, nova);
  }
}
