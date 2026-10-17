
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (
    !token ||
    req.url.includes('/login/') ||
    req.url.includes('/registro/')
  ) {
    return next(req);
  }

  const requestAutenticada = req.clone({
    setHeaders: {
      Authorization: `Token ${token}`
    }
  });

  return next(requestAutenticada);
};
