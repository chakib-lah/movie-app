import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const errorService = inject(ErrorService);
  const router = inject(Router);

  const token = authService.getToken();

  const shouldSkip =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh');

  const authReq =
    !shouldSkip && token
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
      : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !shouldSkip) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // authService.setToken(accessToken);
            const newToken = authService.getToken();
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
              withCredentials: true,
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            authService.logout().subscribe();
            errorService.showLogoutMessage(
              'Session expired. Please log in again.'
            );
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
