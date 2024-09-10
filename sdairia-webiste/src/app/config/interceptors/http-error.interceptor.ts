import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {NotifierService} from "../../services/notifier.service";

export const HTTP_ERROR_INTERCEPTOR: HttpInterceptorFn = (req, next) => {
  const notifierService = inject(NotifierService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string = '';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error}`;
      } else {
        errorMessage = error.error.error;
      }
      notifierService.showError(errorMessage);
      return throwError(() => error);
    }),
  );
};
