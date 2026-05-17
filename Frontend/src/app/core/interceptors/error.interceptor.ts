import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'Ocurrió un error inesperado';
      if (error.error && (error.error.error || error.error.message)) {
        errorMsg = error.error.error || error.error.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      // Pass the extracted clean message down to the global error handler
      return throwError(() => new Error(errorMsg));
    })
  );
};
