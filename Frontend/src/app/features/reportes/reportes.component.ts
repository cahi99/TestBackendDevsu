import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportesFacade } from './reportes.facade';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ReportesFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="view active">
      <div class="view-header">
        <h2>Reportes</h2>
        <form [formGroup]="form" class="header-actions" (ngSubmit)="generar()">
          <input type="date" formControlName="fechaInicio" class="search-input" [class.invalid]="isInvalid('fechaInicio')" />
          <input type="date" formControlName="fechaFin" class="search-input" [class.invalid]="isInvalid('fechaFin')" />
          <input type="number" formControlName="clienteId" class="search-input" placeholder="ID Cliente" [class.invalid]="isInvalid('clienteId')" />
          
          <button type="submit" class="btn btn-secondary" [disabled]="form.invalid">Generar</button>
          <button type="button" class="btn btn-primary" [disabled]="form.invalid" (click)="descargar()">Descargar PDF</button>
        </form>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Número Cuenta</th>
              <th>Tipo</th>
              <th>Saldo Inicial</th>
              <th>Estado</th>
              <th>Movimiento</th>
              <th>Saldo Disponible</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let rep of facade.reportes$ | async; trackBy: trackByIndex">
              <td>{{ rep.fecha }}</td>
              <td>{{ rep.cliente }}</td>
              <td>{{ rep.numeroCuenta }}</td>
              <td>{{ rep.tipo }}</td>
              <td>\${{ (rep.saldoInicial | number:'1.2-2') }}</td>
              <td><span class="status-badge" [class.status-active]="rep.estado" [class.status-inactive]="!rep.estado">{{ rep.estado ? 'Activa' : 'Inactiva' }}</span></td>
              <td [class.val-positive]="rep.movimiento > 0" [class.val-negative]="rep.movimiento <= 0">
                {{ rep.movimiento > 0 ? '+' : '' }}\${{ rep.movimiento | number:'1.2-2' }}
              </td>
              <td>\${{ (rep.saldoDisponible | number:'1.2-2') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .invalid {
      border-color: var(--accent-danger) !important;
      box-shadow: 0 0 0 1px var(--accent-danger) !important;
    }
  `]
})
export class ReportesComponent {
  facade = inject(ReportesFacade);
  private fb = inject(FormBuilder);
  
  form: FormGroup = this.fb.group({
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    clienteId: [null, [Validators.required, Validators.min(1)]]
  });

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  generar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { fechaInicio, fechaFin, clienteId } = this.form.value;
    this.facade.generarReporte(fechaInicio, fechaFin, clienteId);
  }

  descargar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { fechaInicio, fechaFin, clienteId } = this.form.value;
    this.facade.descargarPDF(fechaInicio, fechaFin, clienteId);
  }

  trackByIndex(index: number, item: any) {
    return index; // Reportes usually don't have unique IDs in this view
  }
}
