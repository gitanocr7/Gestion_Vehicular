
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const rol = authService.getRole()
    .trim()
    .toLowerCase();

  if (rol === 'admin' || rol === 'administrador') {
    return true;
  }

  // El usuario normal no puede entrar a páginas administrativas.
  router.navigate(['/']);
  return false;
};
