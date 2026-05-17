import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ReportesFacade {
  private _reportes = new BehaviorSubject<any[]>([]);
  readonly reportes$: Observable<any[]> = this._reportes.asObservable();

  constructor(private api: ApiService, private toast: ToastService) {}

  generarReporte(inicio: string, fin: string, clienteId: number) {
    this.api.getReportes(inicio, fin, clienteId).subscribe((data: any[]) => {
      this._reportes.next(data || []);
      this.toast.show('Reporte generado', 'success');
    });
  }

  descargarPDF(inicio: string, fin: string, clienteId: number) {
    this.api.getReportePdf(inicio, fin, clienteId).subscribe((response: any) => {
      // Extract Base64 string. Fallback logic depending on how backend sends it.
      const base64String = typeof response === 'string' ? response : response.base64;
      
      if (!base64String) {
        this.toast.show('El backend no retornó el Base64', 'error');
        return;
      }
      
      this.downloadBase64Pdf(base64String, 'estado_de_cuenta.pdf');
    });
  }

  private downloadBase64Pdf(base64: string, fileName: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    
    this.toast.show('PDF descargado exitosamente', 'success');
  }
}
