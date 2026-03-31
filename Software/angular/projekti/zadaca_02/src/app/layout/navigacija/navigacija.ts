import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Autentifikacija } from '../../servisi/autentifikacija.service';
import { CommonModule } from '@angular/common';
import { KorisnikI } from '../../servisiI/korisnikI';

@Component({
  selector: 'app-navigacija',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navigacija.html',
  styleUrl: './navigacija.scss',
})
export class Navigacija implements OnInit {
  korisnik: KorisnikI | null = null;

  constructor(private auth: Autentifikacija, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.korisnik = await this.auth.trenutniKorisnik();
  }

  async odjaviSe(): Promise<void> {
    await this.auth.odjava();
    this.korisnik = null;
    await this.router.navigate(['/']);
  }
}
