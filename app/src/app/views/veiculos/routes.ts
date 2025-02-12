import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./veiculos.component').then(m => m.VeiculosComponent),
    data: {
      title: $localize`Veiculos`
    }
  }
];

