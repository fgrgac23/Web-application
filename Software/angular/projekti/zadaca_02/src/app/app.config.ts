import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { APP_CONF, KonfiguratorServis } from './servisi/konfigurator.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAppInitializer(() => inject(KonfiguratorServis).ucitaj()),
    {
      provide: APP_CONF,
      useFactory: () => inject(KonfiguratorServis).dajKonf(),
    },
  ],
};
