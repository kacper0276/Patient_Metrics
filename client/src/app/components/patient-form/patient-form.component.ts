import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { Patient } from '../../models/patient.model';

@Component({
  standalone: true,
  selector: 'app-patient-form',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})
export class PatientFormComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  data = inject(MockDataService);

  patient: Patient = {
    id: 0,
    firstName: '',
    lastName: '',
    pesel: '',
    customData: {},
    userId: this.data.currentUser()?.id ?? 1,
  };

  message = '';

  fields = computed(() => this.data.customFields());

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const stored = this.data.getPatientById(id);
      if (stored) {
        this.patient = { ...stored, customData: { ...stored.customData } };
      }
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
      this.data.addPatient(this.patient);
      this.message = 'Pacjent został dodany.';
    } else {
      this.data.updatePatient(this.patient);
      this.message = 'Pacjent został zaktualizowany.';
    }

    setTimeout(() => this.router.navigate(['/patients']), 500);
  }

  downloadPdf() {
    if (!this.isNew()) {
      this.data.downloadPatientPdf(this.patient);
    }
  }
}
