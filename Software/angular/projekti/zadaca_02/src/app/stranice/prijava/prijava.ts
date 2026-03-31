import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Autentifikacija } from '../../servisi/autentifikacija.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prijava',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prijava.html',
  styleUrl: './prijava.scss',
})
export class Prijava {
  korime = '';
  lozinka = '';
  poruka = '';

  korisniciDemo = [
    { korime: 'admin', lozinka: 'rwa', aktiviran: 'DA' },
    { korime: 'moderator', lozinka: 'rwa', aktiviran: 'DA'  },
    { korime: 'obican', lozinka: 'rwa', aktiviran: 'DA'  },
    { korime: 'fgrgac23', lozinka: 'rwa', aktiviran: 'NE'  }
];


  constructor(private auth: Autentifikacija, private router: Router) {}

  async PrijaviSe() {
    const odgovor = await this.auth.prijava(this.korime, this.lozinka);
    if (odgovor.greska) {
      this.poruka = odgovor.greska;
      return;
    }
    location.href = '/';
  }
}
