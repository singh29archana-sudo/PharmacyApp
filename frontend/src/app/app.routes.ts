import { Routes } from '@angular/router';
import { MedicinesComponent } from './medicines/medicines.component';
import { SalesComponent } from './sales/sales.component';

export const routes: Routes = [
  { path: '', redirectTo: 'medicines', pathMatch: 'full' },
  { path: 'medicines', component: MedicinesComponent },
  { path: 'sales', component: SalesComponent },
];
