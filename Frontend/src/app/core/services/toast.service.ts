import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    const id = this.counter++;
    this.toasts.update(t => [...t, { message, type, id }]);
    setTimeout(() => {
      this.toasts.update(t => t.filter(toast => toast.id !== id));
    }, 4000);
  }
}
