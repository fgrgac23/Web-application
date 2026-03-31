import { Inject, Injectable } from '@angular/core';
import { APP_CONF, KonfiguracijaI } from './konfigurator.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string;

  constructor(@Inject(APP_CONF) conf: KonfiguracijaI) {
    this.baseUrl = conf.restURL;
  }

  async get<T>(putanja: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${putanja}`);
    if (!res.ok) {
      throw new Error(`GET ${putanja} nije uspio`);
    }
    return (await res.json()) as T;
  }

  async post<T>(putanja: string, tijelo: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${putanja}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tijelo),
    });

    if (!res.ok) {
      throw new Error(`POST ${putanja} nije uspio`);
    }

    return (await res.json()) as T;
  }
}
