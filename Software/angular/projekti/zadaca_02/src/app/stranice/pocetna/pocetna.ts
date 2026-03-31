import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KolekcijaI } from '../../servisiI/kolekcijaI';
import { Kolekcije } from '../../servisi/kolekcije.service';

@Component({
  selector: 'app-pocetna',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pocetna.html',
  styleUrls: ['./pocetna.scss'],
})
export class Pocetna implements OnInit {
  javneKolekcije: KolekcijaI[] = [];

  constructor(private kolekcijeServis: Kolekcije) {}

  async ngOnInit() {
    this.javneKolekcije = await this.kolekcijeServis.dohvatiJavne();
  }
}
