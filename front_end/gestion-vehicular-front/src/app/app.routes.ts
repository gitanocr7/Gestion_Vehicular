import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'index',
    loadComponent: () => import('./pages/index/index.page').then(m => m.IndexPage),
    canActivate: [authGuard]
  },
  {
    path: 'vehiculos',
    loadComponent: () => import('./pages/vehiculos/vehiculos.page').then(m => m.VehiculosPage),
    canActivate: [authGuard]
  },
  {
    path: 'mantenciones',
    loadComponent: () => import('./pages/mantenciones/mantenciones.page').then(m => m.MantencionesPage),
    canActivate: [authGuard]
  },
  {
    path: 'personal',
    loadComponent: () => import('./pages/personal/personal.page').then(m => m.PersonalPage),
    canActivate: [authGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  }
];