import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PatientsComponent } from './components/patients/patients.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { CustomFieldsComponent } from './components/custom-fields/custom-fields.component';
import { PdfConfigComponent } from './components/pdf-config/pdf-config.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'patients/new', component: PatientFormComponent },
  { path: 'patients/:id', component: PatientFormComponent },
  { path: 'fields', component: CustomFieldsComponent },
  { path: 'config', component: PdfConfigComponent },
];
