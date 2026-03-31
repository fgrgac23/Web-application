import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Autentifikacija } from '../../servisi/autentifikacija.service';
import {
  RegistracijaZahtjev,
  RegistracijaOdgovor,
} from '../../servisiI/registracijaI';

@Component({
  selector: 'app-registracija',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registracija.html',
  styleUrl: './registracija.scss',
})
export class RegistracijaComponent {
  model: RegistracijaZahtjev = {
    ime: '',
    prezime: '',
    korime: '',
    lozinka: '',
    email: '',
    drzava: null,
    grad: null,
    opis: null,
  };

  poruka: string = '';

  constructor(private auth: Autentifikacija) {}

  async registrirajSe(): Promise<void> {
    const odgovor: RegistracijaOdgovor = await this.auth.registracija(
      this.model
    );

    if (odgovor.greska) {
      this.poruka = odgovor.greska;
    } else if (odgovor.poruka) {
      this.poruka = odgovor.poruka;
    } else {
      this.poruka = 'Registracija uspješna';
    }
  }
}
