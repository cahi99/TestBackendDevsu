import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    // Un ErrorHandler global intercepta todo tipo de errores (promesas, http, sintaxis en runtime)
    const toastService = this.injector.get(ToastService);
    
    // Extracción limpia del mensaje
    const message = error.message ? error.message : error.toString();
    
    // Si no es un error de Zone.js ignorado, mostramos el Toast
    toastService.show(message, 'error');
    console.error('Global Error Handled:', error);
  }
}
