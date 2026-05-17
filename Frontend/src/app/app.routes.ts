import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', loadChildren: () => import('./features/clientes/clientes.routes').then(m => m.routes) },
  { path: 'cuentas', loadChildren: () => import('./features/cuentas/cuentas.routes').then(m => m.routes) },
  { path: 'movimientos', loadChildren: () => import('./features/movimientos/movimientos.routes').then(m => m.routes) },
  { path: 'reportes', loadChildren: () => import('./features/reportes/reportes.routes').then(m => m.routes) }
];
