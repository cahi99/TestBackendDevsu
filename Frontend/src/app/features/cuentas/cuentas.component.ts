import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentasFacade } from './cuentas.facade';

@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [CuentasFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="view active">
      <div class="view-header">
        <h2>Cuentas</h2>
        <div class="header-actions">
          <input type="text" (input)="onSearch($event)" class="search-input" placeholder="Buscar cuenta..." />
          <button class="btn btn-primary" (click)="openModal()">Nueva</button>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente ID</th>
              <th>Tipo</th>
              <th>Saldo Inicial</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of facade.filteredCuentas$ | async; trackBy: trackByNumero">
              <td>{{ c.numeroCuenta }}</td>
              <td>{{ c.cliente?.id || c.clienteId || '-' }}</td>
              <td>{{ c.tipoCuenta }}</td>
              <td>\${{ (c.saldoInicial | number:'1.2-2') || '0.00' }}</td>
              <td><span class="status-badge" [class.status-active]="c.estado" [class.status-inactive]="!c.estado">{{ c.estado ? 'Activa' : 'Inactiva' }}</span></td>
              <td class="action-buttons">
                <button class="btn btn-secondary btn-small" (click)="openModal(c)">Editar</button>
                <button class="btn btn-danger btn-small" (click)="delete(c.numeroCuenta)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal-overlay" [class.active]="isModalOpen">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingNumero ? 'Editar Cuenta' : 'Nueva Cuenta' }}</h3>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="form-group">
              <label>Número de Cuenta</label>
              <input type="text" formControlName="numeroCuenta" class="form-input" [class.invalid]="isInvalid('numeroCuenta')">
            </div>
            <div class="form-group">
              <label>Tipo de Cuenta</label>
              <select formControlName="tipoCuenta" class="form-select">
                <option value="Ahorro">Ahorro</option>
                <option value="Corriente">Corriente</option>
              </select>
            </div>
            <div class="form-group">
              <label>Saldo Inicial</label>
              <input type="number" step="0.01" formControlName="saldoInicial" class="form-input" [class.invalid]="isInvalid('saldoInicial')">
            </div>
            <div class="form-group">
              <label>Cliente ID</label>
              <input type="number" formControlName="clienteId" class="form-input" [class.invalid]="isInvalid('clienteId')">
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select formControlName="estado" class="form-select">
                <option [ngValue]="true">Activa</option>
                <option [ngValue]="false">Inactiva</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Guardar</button>
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
export class CuentasComponent implements OnInit {
  facade = inject(CuentasFacade);
  private fb = inject(FormBuilder);
  
  isModalOpen = false;
  editingNumero: string | null = null;
  
  form: FormGroup = this.fb.group({
    numeroCuenta: ['', Validators.required],
    tipoCuenta: ['Ahorro', Validators.required],
    saldoInicial: [0, [Validators.required, Validators.min(0)]],
    clienteId: ['', Validators.required],
    estado: [true]
  });

  ngOnInit() {
    this.facade.loadCuentas();
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.facade.search(target.value);
  }

  trackByNumero(index: number, item: any) {
    return item.numeroCuenta;
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  openModal(cuenta?: any) {
    this.editingNumero = cuenta ? cuenta.numeroCuenta : null;
    this.form.reset({ estado: true, tipoCuenta: 'Ahorro' });
    
    if (cuenta) {
      this.form.patchValue({
        ...cuenta,
        clienteId: cuenta.cliente?.id || cuenta.clienteId
      });
      this.form.get('numeroCuenta')?.disable();
      this.form.get('saldoInicial')?.disable();
      this.form.get('clienteId')?.disable();
    } else {
      this.form.get('numeroCuenta')?.enable();
      this.form.get('saldoInicial')?.enable();
      this.form.get('clienteId')?.enable();
    }
    
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
    
    // getRawValue gets disabled values too
    const rawVal = this.form.getRawValue();
    const payload: any = {
      estado: rawVal.estado,
      tipoCuenta: rawVal.tipoCuenta
    };

    if (!this.editingNumero) {
      payload.numeroCuenta = rawVal.numeroCuenta;
      payload.saldoInicial = rawVal.saldoInicial;
      payload.cliente = { id: rawVal.clienteId };
    }

    this.facade.saveCuenta(payload, this.editingNumero || undefined).subscribe(() => {
      this.closeModal();
    });
  }

  delete(numero: string) {
    if (confirm('¿Eliminar esta cuenta?')) {
      this.facade.deleteCuenta(numero);
    }
  }
}
