import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigacija } from './layout/navigacija/navigacija';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigacija],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('zadaca_02');
}
