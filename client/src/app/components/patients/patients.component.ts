import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  standalone: true,
  selector: 'app-patients',
  imports: [CommonModule, RouterModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent {
  data = inject(MockDataService);
  router = inject(Router);

  edit(id: number) {
    this.router.navigate(['/patients', id]);
  }

  downloadPdf(patient: any) {
    this.data.downloadPatientPdf(patient);
  }

  formatValue(value: any) {
    if (value === true) return 'Tak';
    if (value === false) return 'Nie';
    return value || '-';
  }
}
