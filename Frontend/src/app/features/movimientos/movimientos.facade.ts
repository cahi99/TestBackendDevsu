import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Injectable()
export class MovimientosFacade {
  private _movimientos = new BehaviorSubject<any[]>([]);
  private _searchTerm = new BehaviorSubject<string>('');
  private _searchSubject = new Subject<string>();

  readonly movimientos$: Observable<any[]> = this._movimientos.asObservable();
  readonly searchTerm$: Observable<string> = this._searchTerm.asObservable();

  readonly filteredMovimientos$: Observable<any[]> = combineLatest([
    this.movimientos$,
    this.searchTerm$
  ]).pipe(
    map(([movimientos, term]: [any[], string]) => {
      const lowerTerm = term.toLowerCase();
      return movimientos.filter(m => {
        const cuentaMatches = m.cuenta?.numeroCuenta ? String(m.cuenta.numeroCuenta).toLowerCase().includes(lowerTerm) : false;
        const idMatches = m.id ? String(m.id).includes(lowerTerm) : false;
        return cuentaMatches || idMatches;
      });
    })
  );

  constructor(private api: ApiService, private toast: ToastService) {
    this._searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term: string) => this._searchTerm.next(term));
  }

  loadMovimientos() {
    this.api.getMovimientos().subscribe((data: any[]) => this._movimientos.next(data || []));
  }

  search(term: string) {
    this._searchSubject.next(term);
  }

  saveMovimiento(payload: any): Observable<any> {
    return this.api.createMovimiento(payload).pipe(
      tap(() => {
        this.toast.show('Movimiento registrado', 'success');
        this.loadMovimientos();
      })
    );
  }
}
