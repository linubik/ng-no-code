import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // This removes the requirement for zone.js
    provideZonelessChangeDetection(),
    provideRouter(routes),
  ],
};
