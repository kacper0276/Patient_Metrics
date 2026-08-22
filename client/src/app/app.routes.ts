import { Routes } from '@angular/router';
import { CustomFieldsComponent } from '@pages/custom-fields/custom-fields.component';
import { LoginComponent } from '@pages/login/login.component';
import { PatientFormComponent } from '@pages/patient-form/patient-form.component';
import { PatientsComponent } from '@pages/patients/patients.component';
import { PdfConfigComponent } from '@pages/pdf-config/pdf-config.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'patients', component: PatientsComponent, canActivate: [authGuard] },
  {
    path: 'patients/new',
    component: PatientFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'patients/:id',
    component: PatientFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'fields',
    component: CustomFieldsComponent,
    canActivate: [authGuard],
  },
  { path: 'config', component: PdfConfigComponent, canActivate: [authGuard] },
];
