import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  AuthService,
  CustomFieldsService,
  PatientsService,
  ToastrService,
} from '@shared/services';
import { CustomField, Patient } from '@shared/models';

@Component({
  standalone: true,
  selector: 'app-patient-form',
  imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})
export class PatientFormComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  private readonly patientsService = inject(PatientsService);
  private readonly fieldsService = inject(CustomFieldsService);
  private readonly auth = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  patient: Patient = {
    id: 0,
    firstName: '',
    lastName: '',
    pesel: '',
    customData: {},
    userId: this.auth.currentUser?.id ?? 0,
  };

  message = '';

  fields = signal<CustomField[]>([]);

  constructor() {
    this.fieldsService.findAll().subscribe(({ data }) => this.fields.set(data));
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.patientsService.findOne(Number(idParam)).subscribe(({ data }) => {
        this.patient = { ...data, customData: { ...data.customData } };
      });
    }
  }

  isNew() {
    return this.patient.id === 0;
  }

  save() {
    if (!this.patient.firstName.trim() || !this.patient.lastName.trim()) {
      this.message = 'Imię i nazwisko są wymagane.';
      return;
    }

    if (this.isNew()) {
      const { id: _id, userId: _userId, ...payload } = this.patient;
      this.patientsService.create(payload).subscribe(() => {
        this.completeSave('Pacjent został dodany.');
      });
    } else {
      this.patientsService
        .update(this.patient.id, this.patient)
        .subscribe(() => {
          this.completeSave('Pacjent został zaktualizowany.');
        });
    }
  }

  private completeSave(message: string) {
    this.message = message;
    this.toastr.showSuccess(message);
    setTimeout(() => void this.router.navigate(['/patients']), 500);
  }

  downloadPdf() {
    this.toastr.showInfo('Generowanie PDF jest dostępne z listy pacjentów.');
  }
}
