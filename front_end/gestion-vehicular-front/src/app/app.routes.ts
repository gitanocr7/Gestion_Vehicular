
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page')
        .then(m => m.LoginPage)
  },
  {
    path: 'index',
    loadComponent: () =>
      import('./pages/index/index.page')
        .then(m => m.IndexPage)
  },
  {
    path: 'vehiculos',
    loadComponent: () =>
      import('./pages/vehiculos/vehiculos.page')
        .then(m => m.VehiculosPage)
  },
  {
    path: 'mantenciones',
    loadComponent: () =>
      import('./pages/mantenciones/mantenciones.page')
        .then(m => m.MantencionesPage),
    canActivate: [authGuard]
  },
  {
    path: 'mapa-grifos',
    loadComponent: () =>
      import('./pages/mapa-grifos/mapa-grifos.page')
        .then(m => m.MapaGrifosPage)
  },
  {
    path: 'personal',
    loadComponent: () =>
      import('./pages/personal/personal.page')
        .then(m => m.PersonalPage),
    canActivate: [authGuard]
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page')
        .then(m => m.RegisterPage)
  },
  {
    path: 'talleres',
    loadComponent: () =>
      import('./pages/talleres/talleres.page')
        .then(m => m.TalleresPage)
  },
  {
    path: '**',
    redirectTo: 'index'
  }
];
