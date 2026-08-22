import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  AuthService,
  CustomFieldsService,
  PatientsService,
  PdfService,
  ToastrService,
} from '@shared/services';
import { CustomField, Patient } from '@shared/models';

@Component({
  standalone: true,
  selector: 'app-patients',
  imports: [CommonModule, RouterModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent {
  private readonly patientsService = inject(PatientsService);
  private readonly fieldsService = inject(CustomFieldsService);
  private readonly auth = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly pdf = inject(PdfService);
  readonly router = inject(Router);
  readonly patients = signal<Patient[]>([]);
  readonly customFields = signal<CustomField[]>([]);
  readonly currentUserName = this.auth.currentUser?.name || 'Gość';

  constructor() {
    this.load();
  }

  load() {
    this.patientsService
      .findAll()
      .subscribe(({ data }) => this.patients.set(data));
    this.fieldsService
      .findAll()
      .subscribe(({ data }) => this.customFields.set(data));
  }

  edit(id: number) {
    this.router.navigate(['/patients', id]);
  }

  downloadPdf(patient: Patient) {
    this.pdf.generate(patient);
  }

  importExcel(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.patientsService.import(file).subscribe(({ data }) => {
      this.toastr.showSuccess(
        `Zaimportowano ${data.imported} pacjentów z arkuszy: ${data.sheets.join(', ') || 'brak'}.`,
      );
      if (data.skipped) {
        this.toastr.showWarning(
          `Pominięto ${data.skipped} wierszy bez imienia lub nazwiska.`,
        );
      }
      this.load();
      input.value = '';
    });
  }

  remove(id: number) {
    this.patientsService.delete(id).subscribe(() => {
      this.patients.update((items) =>
        items.filter((patient) => patient.id !== id),
      );
      this.toastr.showSuccess('Pacjent został usunięty.');
    });
  }

  formatValue(value: any) {
    if (value === true) return 'Tak';
    if (value === false) return 'Nie';
    if (typeof value === 'number') {
      return value.toLocaleString('pl-PL', { maximumFractionDigits: 2 });
    }
    return value ?? '-';
  }

  displayedFields(patient: Patient) {
    return this.customFields().filter(
      (field) =>
        !this.isIgnoredField(field.name) &&
        Object.prototype.hasOwnProperty.call(patient.customData, field.key),
    );
  }

  private isIgnoredField(name: string) {
    const normalized = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    return (
      /^empty\d*$/.test(normalized) ||
      normalized === 'wynikibadan' ||
      normalized === 'produktyzywnosciowe'
    );
  }
}
