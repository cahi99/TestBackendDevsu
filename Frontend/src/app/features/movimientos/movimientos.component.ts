import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientosFacade } from './movimientos.facade';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [MovimientosFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="view active">
      <div class="view-header">
        <h2>Movimientos</h2>
        <div class="header-actions">
          <input type="text" (input)="onSearch($event)" class="search-input" placeholder="Buscar movimiento..." />
          <button class="btn btn-primary" (click)="openModal()">Nuevo</button>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cuenta</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Saldo Restante</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of facade.filteredMovimientos$ | async; trackBy: trackById">
              <td>{{ m.id || '-' }}</td>
              <td>{{ m.cuenta?.numeroCuenta || '-' }}</td>
              <td>{{ (m.fecha | date:'shortDate') || '-' }}</td>
              <td>{{ (m.valor > 0) ? 'Depósito' : 'Retiro' }}</td>
              <td [class.val-positive]="m.valor > 0" [class.val-negative]="m.valor <= 0">
                {{ m.valor > 0 ? '+' : '' }}\${{ m.valor | number:'1.2-2' }}
              </td>
              <td>\${{ (m.saldo || 0) | number:'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal-overlay" [class.active]="isModalOpen">
      <div class="modal">
        <div class="modal-header">
          <h3>Nuevo Movimiento</h3>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="form-group">
              <label>Número de Cuenta</label>
              <input type="text" formControlName="numeroCuenta" class="form-input" [class.invalid]="isInvalid('numeroCuenta')">
            </div>
            <div class="form-group">
              <label>Tipo de Movimiento</label>
              <select formControlName="tipo" class="form-select">
                <option value="deposito">Depósito (+)</option>
                <option value="retiro">Retiro (-)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Valor</label>
              <input type="number" step="0.01" min="0.01" formControlName="valor" class="form-input" 
                     [placeholder]="form.get('tipo')?.value === 'retiro' ? 'Ej. 500 (se enviará negativo)' : 'Ej. 500'" 
                     [class.invalid]="isInvalid('valor')">
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Registrar</button>
            </div>
          </form>
        </div>
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
export class MovimientosComponent implements OnInit {
  facade = inject(MovimientosFacade);
  private fb = inject(FormBuilder);
  
  isModalOpen = false;
  
  form: FormGroup = this.fb.group({
    numeroCuenta: ['', Validators.required],
    tipo: ['deposito', Validators.required],
    valor: [null, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit() {
    this.facade.loadMovimientos();
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.facade.search(target.value);
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  openModal() {
    this.form.reset({ tipo: 'deposito' });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const { numeroCuenta, tipo, valor } = this.form.value;
    
    let finalValor = valor;
    if (tipo === 'retiro') {
      finalValor = -Math.abs(valor);
    } else {
      finalValor = Math.abs(valor);
    }

    const payload = {
      cuenta: { numeroCuenta: numeroCuenta },
      valor: finalValor
    };

    this.facade.saveMovimiento(payload).subscribe(() => {
      this.closeModal();
    });
  }
}
