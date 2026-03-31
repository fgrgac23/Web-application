import { Routes } from '@angular/router';
import { Pocetna } from './stranice/pocetna/pocetna';
import { DetaljiKolekcije } from './stranice/detalji-kolekcije/detalji-kolekcije';
import { Prijava } from './stranice/prijava/prijava';
import { RegistracijaComponent } from './stranice/registracija/registracija';
import { AdminPanel } from './stranice/administratorski-panel/administratorski-panel';
import { ModeratorskiPanel } from './stranice/moderatorski-panel/moderatorski-panel';
import { Sadrzaj } from './stranice/sadrzaj/sadrzaj';
import { MojeKolekcije } from './stranice/moje-kolekcije/moje-kolekcije';
import { Dokumentacija } from './stranice/dokumentacija/dokumentacija';
import { JavniSadrzajComponent } from './stranice/javni-sadrzaj/javni-sadrzaj';

export const routes: Routes = [
  {
    path: '',
    component: Pocetna,
  },
  { path: 'kolekcija/:id', component: DetaljiKolekcije },
  { path: 'prijava', component: Prijava },
  { path: 'registracija', component: RegistracijaComponent },
  {
    path: 'admin',
    component: AdminPanel,
  },
  {
    path: 'moderator',
    component: ModeratorskiPanel,
  },
  {
    path: 'sadrzaj',
    component: Sadrzaj,
  },
  {
    path: 'mojeKolekcije',
    component: MojeKolekcije,
  },
  {
    path: 'dokumentacija',
    component: Dokumentacija,
  },

  {
    path: 'javniSadrzaj',
    component: JavniSadrzajComponent,
  },
];
