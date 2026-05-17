import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    this.api.getReportes(inicio, fin, clienteId).subscribe((data: any[]) => {
      const reportes = data || [];
      if (reportes.length === 0) {
        this.toast.show('No hay datos para generar el PDF', 'error');
        return;
      }

      const doc = new jsPDF();
      doc.text(`Estado de Cuenta - Cliente ${clienteId}`, 14, 15);
      doc.text(`Desde: ${inicio} Hasta: ${fin}`, 14, 25);

      const tableData = reportes.map(r => [
        r.fecha || '-',
        r.cliente || '-',
        r.numeroCuenta || '-',
        r.tipo || '-',
        `$${r.saldoInicial || '0.00'}`,
        r.estado ? 'Activa' : 'Inactiva',
        `$${r.movimiento || '0.00'}`,
        `$${r.saldoDisponible || '0.00'}`
      ]);

      autoTable(doc, {
        startY: 30,
        head: [['Fecha', 'Cliente', 'Numero Cuenta', 'Tipo', 'Saldo Inicial', 'Estado', 'Movimiento', 'Saldo Disponible']],
        body: tableData,
      });

      doc.save(`Reporte_${clienteId}_${inicio}.pdf`);
      this.toast.show('PDF descargado exitosamente', 'success');
    });
  }
}
