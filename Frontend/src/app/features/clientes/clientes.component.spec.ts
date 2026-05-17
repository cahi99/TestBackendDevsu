import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesComponent } from './clientes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientesFacade } from './clientes.facade';
import { of } from 'rxjs';

// Mock Facade
class MockClientesFacade {
  filteredClientes$ = of([]);
  loadClientes = jest.fn();
  search = jest.fn();
  saveCliente = jest.fn().mockReturnValue(of({}));
}

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;
  let facade: ClientesFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesComponent, ReactiveFormsModule]
    })
    .overrideComponent(ClientesComponent, {
      set: {
        providers: [
          { provide: ClientesFacade, useClass: MockClientesFacade }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
    facade = fixture.debugElement.injector.get(ClientesFacade);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debe ser inválido si está vacío', () => {
    component.openModal();
    expect(component.form.valid).toBeFalsy();
  });

  it('el formulario debe ser válido cuando se llenan todos los campos correctamente', () => {
    component.openModal();
    component.form.patchValue({
      nombre: 'Cris Holguin',
      identificacion: '1234567890',
      edad: 30,
      genero: 'Masculino',
      telefono: '0987654321',
      direccion: 'Av Siempre Viva 123',
      contrasena: 'password123',
      estado: true
    });
    
    expect(component.form.valid).toBeTruthy();
  });

  it('debería llamar a saveCliente del Facade al guardar el formulario válido', () => {
    component.openModal();
    component.form.patchValue({
      nombre: 'Cris Holguin',
      identificacion: '1234567890',
      edad: 30,
      genero: 'Masculino',
      telefono: '0987654321',
      direccion: 'Av Siempre Viva 123',
      contrasena: 'password123',
      estado: true
    });
    
    component.save();
    
    expect(facade.saveCliente).toHaveBeenCalled();
  });
});
