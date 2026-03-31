  import { ApplicationConfig } from '@angular/core';
  import { provideRouter } from '@angular/router';
  import { provideHttpClient } from '@angular/common/http';
  import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
  import { provideNativeDateAdapter } from '@angular/material/core';
  import { routes } from './app.routes';
 
  export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(routes),
      provideHttpClient(),
      // FIX: async invece di sync — risolve il blocco degli input
      provideAnimationsAsync(),
      provideNativeDateAdapter(),
    ]
  };
