import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Autentifikacija } from '../../servisi/autentifikacija.service';
import { JavniSadrzajServis } from '../../servisi/javniSadrzaj.service';
import { JavniSadrzajI } from '../../servisiI/sadrzajI';

@Component({
  selector: 'app-javni-sadrzaj',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './javni-sadrzaj.html',
  styleUrl: './javni-sadrzaj.scss',
})
export class JavniSadrzajComponent {
  pojam = '';
  sadrzaji: JavniSadrzajI[] = [];
  poruka = '';

  autori: string[] = [];
  odabraniAutor: string | null = null;
  datumOd: string | null = null;
  datumDo: string | null = null;

  constructor(
    private auth: Autentifikacija,
    private servis: JavniSadrzajServis
  ) {}

  async ngOnInit(): Promise<void> {
    const korisnik = await this.auth.trenutniKorisnik();
    if (!korisnik) {
      this.poruka = 'Morate biti prijavljeni.';
      return;
    }

    this.sadrzaji = [];

    const svi = await this.servis.dohvati('');
    this.autori = Array.from(
      new Set(svi.map(s => s.autor).filter(a => a && a.trim() !== ''))
    );
  }


  async pretrazi(): Promise<void> {
    const pojamTrim = this.pojam.trim();

    if (pojamTrim.length < 3) {
      this.sadrzaji = [];
      return;
    }

    try {
      this.sadrzaji = await this.servis.dohvati(pojamTrim);
      this.poruka = '';
    } catch {
      this.sadrzaji = [];
      this.poruka = 'Greška pri dohvaćanju javnog sadržaja';
    }
  }

  async filtriraj(): Promise<void> {
    if (!this.odabraniAutor && !this.datumOd && !this.datumDo) {
      this.sadrzaji = [];
      return;
    }

    try {
      this.sadrzaji = await this.servis.filtriraj(
        this.odabraniAutor,
        this.datumOd,
        this.datumDo
      );
      this.poruka = '';
    } catch {
      this.sadrzaji = [];
      this.poruka = 'Greška pri filtriranju';
    }
  }
}
