import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesFacade } from './clientes.facade';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ClientesFacade], // Scoped to this component
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="view active">
      <div class="view-header">
        <h2>Clientes</h2>
        <div class="header-actions">
          <input type="text" (input)="onSearch($event)" class="search-input" placeholder="Buscar cliente..." />
          <button class="btn btn-primary" (click)="openModal()">Nuevo</button>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Identificación</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Género</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of facade.filteredClientes$ | async; trackBy: trackById">
              <td>{{ c.id || '-' }}</td>
              <td>{{ c.identificacion }}</td>
              <td>{{ c.nombre }}</td>
              <td>{{ c.edad }}</td>
              <td>{{ c.genero }}</td>
              <td>{{ c.telefono }}</td>
              <td><span class="status-badge" [class.status-active]="c.estado" [class.status-inactive]="!c.estado">{{ c.estado ? 'Activo' : 'Inactivo' }}</span></td>
              <td class="action-buttons">
                <button class="btn btn-secondary btn-small" (click)="openModal(c)">Editar</button>
                <button class="btn btn-danger btn-small" (click)="delete(c.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form (Reactive) -->
    <div class="modal-overlay" [class.active]="isModalOpen">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingId ? 'Editar Cliente' : 'Nuevo Cliente' }}</h3>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" formControlName="nombre" class="form-input" [class.invalid]="isInvalid('nombre')">
            </div>
            <div class="form-group">
              <label>Identificación</label>
              <input type="text" formControlName="identificacion" class="form-input" [class.invalid]="isInvalid('identificacion')">
            </div>
            <div class="form-group">
              <label>Edad</label>
              <input type="number" formControlName="edad" class="form-input" [class.invalid]="isInvalid('edad')">
            </div>
            <div class="form-group">
              <label>Género</label>
              <select formControlName="genero" class="form-select">
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input type="text" formControlName="telefono" class="form-input" [class.invalid]="isInvalid('telefono')">
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <input type="text" formControlName="direccion" class="form-input" [class.invalid]="isInvalid('direccion')">
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input type="password" formControlName="contrasena" class="form-input" [class.invalid]="isInvalid('contrasena')">
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select formControlName="estado" class="form-select">
                <option [ngValue]="true">Activo</option>
                <option [ngValue]="false">Inactivo</option>
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
export class ClientesComponent implements OnInit {
  facade = inject(ClientesFacade);
  private fb = inject(FormBuilder);
  
  isModalOpen = false;
  editingId: number | null = null;
  
  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    identificacion: ['', [Validators.required, Validators.minLength(10)]],
    edad: ['', [Validators.required, Validators.min(18)]],
    genero: ['Masculino', Validators.required],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    contrasena: ['', Validators.required],
    estado: [true]
  });

  ngOnInit() {
    this.facade.loadClientes();
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

  openModal(cliente?: any) {
    this.editingId = cliente ? cliente.id : null;
    this.form.reset({ estado: true, genero: 'Masculino' });
    
    if (cliente) {
      this.form.patchValue(cliente);
      this.form.get('contrasena')?.clearValidators();
      this.form.get('contrasena')?.updateValueAndValidity();
    } else {
      this.form.get('contrasena')?.setValidators([Validators.required]);
      this.form.get('contrasena')?.updateValueAndValidity();
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
    const payload = { ...this.form.value };
    if (!payload.contrasena) delete payload.contrasena;

    // Use async pipe ideally, but since we are handling a UI side effect (closing modal):
    this.facade.saveCliente(payload, this.editingId || undefined).subscribe(() => {
      this.closeModal();
    });
  }

  delete(id: number) {
    if (confirm('¿Eliminar este cliente?')) {
      this.facade.deleteCliente(id);
    }
  }
}
