import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Nota: el proyecto no incluye zone.js (no está en polyfills ni en package.json),
// por lo que la app corre en modo "zoneless". Sin `provideZonelessChangeDetection()`,
// Angular no vuelve a renderizar la vista cuando llegan datos de forma asíncrona
// (por ejemplo, la respuesta de un HttpClient.subscribe()): la pantalla se queda
// pegada en estados como "Cargando..." aunque los datos ya llegaron. Este proveedor
// corrige ese problema en toda la app (login, registro y las nuevas páginas públicas).
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideHttpClient(),
    provideZonelessChangeDetection(),
  ],
});
