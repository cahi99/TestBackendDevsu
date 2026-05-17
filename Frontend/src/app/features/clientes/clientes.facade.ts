import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

@Injectable()
export class ClientesFacade {
  private _clientes = new BehaviorSubject<any[]>([]);
  private _searchTerm = new BehaviorSubject<string>('');
  private _searchSubject = new Subject<string>();

  // State exposed as observables
  readonly clientes$: Observable<any[]> = this._clientes.asObservable();
  readonly searchTerm$: Observable<string> = this._searchTerm.asObservable();

  // Derived state using map
  readonly filteredClientes$: Observable<any[]> = combineLatest([
    this.clientes$,
    this.searchTerm$
  ]).pipe(
    map(([clientes, term]: [any[], string]) => {
      const lowerTerm = term.toLowerCase();
      return clientes.filter(c => {
        const nameMatches = c.nombre ? String(c.nombre).toLowerCase().includes(lowerTerm) : false;
        const idMatches = c.identificacion ? String(c.identificacion).includes(lowerTerm) : false;
        return nameMatches || idMatches;
      });
    })
  );

  constructor(private api: ApiService, private toast: ToastService) {
    // Implement DebounceTime for search
    this._searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term: string) => this._searchTerm.next(term));
  }

  loadClientes() {
    this.api.getClientes().subscribe((data: any[]) => this._clientes.next(data || []));
  }

  search(term: string) {
    this._searchSubject.next(term);
  }

  saveCliente(payload: any, id?: number): Observable<any> {
    const obs$ = id ? this.api.updateCliente(id, payload) : this.api.createCliente(payload);
    return obs$.pipe(
      tap(() => {
        this.toast.show(`Cliente ${id ? 'actualizado' : 'creado'}`, 'success');
        this.loadClientes(); // Reload table automatically
      })
    );
  }

  deleteCliente(id: number) {
    this.api.deleteCliente(id).subscribe(() => {
      this.toast.show('Cliente eliminado', 'success');
      this.loadClientes();
    });
  }
}
