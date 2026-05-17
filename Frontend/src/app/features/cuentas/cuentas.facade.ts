import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Injectable()
export class CuentasFacade {
  private _cuentas = new BehaviorSubject<any[]>([]);
  private _searchTerm = new BehaviorSubject<string>('');
  private _searchSubject = new Subject<string>();

  readonly cuentas$: Observable<any[]> = this._cuentas.asObservable();
  readonly searchTerm$: Observable<string> = this._searchTerm.asObservable();

  readonly filteredCuentas$: Observable<any[]> = combineLatest([
    this.cuentas$,
    this.searchTerm$
  ]).pipe(
    map(([cuentas, term]: [any[], string]) => {
      const lowerTerm = term.toLowerCase();
      return cuentas.filter(c => {
        return c.numeroCuenta ? String(c.numeroCuenta).toLowerCase().includes(lowerTerm) : false;
      });
    })
  );

  constructor(private api: ApiService, private toast: ToastService) {
    this._searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term: string) => this._searchTerm.next(term));
  }

  loadCuentas() {
    this.api.getCuentas().subscribe((data: any[]) => this._cuentas.next(data || []));
  }

  search(term: string) {
    this._searchSubject.next(term);
  }

  saveCuenta(payload: any, numero?: string): Observable<any> {
    const obs$ = numero ? this.api.updateCuenta(numero, payload) : this.api.createCuenta(payload);
    return obs$.pipe(
      tap(() => {
        this.toast.show(`Cuenta ${numero ? 'actualizada' : 'creada'}`, 'success');
        this.loadCuentas();
      })
    );
  }

  deleteCuenta(numero: string) {
    this.api.deleteCuenta(numero).subscribe(() => {
      this.toast.show('Cuenta eliminada', 'success');
      this.loadCuentas();
    });
  }
}
