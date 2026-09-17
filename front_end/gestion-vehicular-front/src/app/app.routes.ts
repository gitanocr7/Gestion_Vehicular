import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

// Nota sobre el alcance público del proyecto: el sistema no es de uso exclusivo del
// personal de Bomberos. Cualquier persona (ciudadanía) puede consultar el estado de
// la flota, el historial de mantenciones y el mapa de grifos/puntos de interés sin
// necesidad de iniciar sesión (ver historias de usuario "Como ciudadano..."). El login
// solo es obligatorio para las funciones de gestión interna (registrar/editar datos,
// administrar personal), por eso únicamente 'personal' queda protegida con authGuard.
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'index',
    loadComponent: () => import('./pages/index/index.page').then(m => m.IndexPage)
  },
  {
    path: 'vehiculos',
    loadComponent: () => import('./pages/vehiculos/vehiculos.page').then(m => m.VehiculosPage)
  },
  {
    path: 'mantenciones',
    loadComponent: () => import('./pages/mantenciones/mantenciones.page').then(m => m.MantencionesPage)
  },
  {
    path: 'mapa-grifos',
    loadComponent: () => import('./pages/mapa-grifos/mapa-grifos.page').then(m => m.MapaGrifosPage)
  },
  {
    path: 'personal',
    loadComponent: () => import('./pages/personal/personal.page').then(m => m.PersonalPage),
    canActivate: [authGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    // 'talleres' y 'avisos' aparecen en la navegación (índice/footer) pero sus páginas
    // todavía no están implementadas (quedan como trabajo pendiente, ver Product Backlog
    // HU-10/11/12 y HU-18). Para no dejar la navegación rota mientras tanto, cualquier
    // ruta desconocida vuelve al inicio en vez de mostrar una pantalla en blanco.
    path: '**',
    redirectTo: 'index'
  }
];