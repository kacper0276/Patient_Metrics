import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../services/spinner.service';
import { ToastrService } from '../services/toastr.service';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const spinner = inject(SpinnerService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const token = auth.token;
  const authorizedRequest = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  spinner.show();
  return next(authorizedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        auth.logout();
        if (!request.url.includes('/auth/login')) {
          void router.navigate(['/login']);
        }
      }

      const message =
        error.error?.message || 'Wystąpił błąd komunikacji z serwerem.';
      toastr.showError(message);
      return throwError(() => error);
    }),
    finalize(() => spinner.hide()),
  );
};
