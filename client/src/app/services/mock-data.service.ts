import { Injectable, computed, signal } from '@angular/core';
import { Patient } from '../models/patient.model';
import { CustomField, FieldType } from '../models/custom-field.model';
import { User, UserRole } from '../models/user.model';
import { UserPdfConfig } from '../models/pdf-config.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

const pdfMakeLib = (pdfMake as any).default || pdfMake;
const pdfFontsLib = (pdfFonts as any).default || pdfFonts;

pdfMakeLib.vfs = pdfFontsLib?.pdfMake?.vfs || pdfFontsLib;

const users: User[] = [
  {
    id: 1,
    email: 'admin@patientmetrics.local',
    name: 'Admin Kliniki',
    role: 'admin',
  },
  {
    id: 2,
    email: 'doctor@patientmetrics.local',
    name: 'Dr. Maria',
    role: 'doctor',
  },
];

@Injectable({ providedIn: 'root' })
export class MockDataService {
  currentUser = signal<User | null>(users[0]);

  patients = signal<Patient[]>([
    {
      id: 1,
      firstName: 'Anna',
      lastName: 'Nowak',
      pesel: '88010112345',
      customData: {
        'blood-pressure': '120/80',
        height: 168,
        smoker: false,
      },
      userId: 1,
    },
    {
      id: 2,
      firstName: 'Paweł',
      lastName: 'Kowalski',
      pesel: '76050154321',
      customData: {
        'blood-pressure': '130/85',
        height: 180,
        smoker: true,
      },
      userId: 1,
    },
  ]);

  customFields = signal<CustomField[]>([
    {
      id: 1,
      name: 'Ciśnienie krwi',
      key: 'blood-pressure',
      type: 'text',
      userId: 1,
    },
    {
      id: 2,
      name: 'Wzrost (cm)',
      key: 'height',
      type: 'number',
      userId: 1,
    },
    {
      id: 3,
      name: 'Palenie papierosów',
      key: 'smoker',
      type: 'boolean',
      userId: 1,
    },
  ]);

  pdfConfig = signal<UserPdfConfig>({
    reportTitle: 'Podsumowanie pacjenta',
    selectedStandardFields: ['firstName', 'lastName', 'pesel'],
    selectedCustomFieldKeys: ['blood-pressure', 'height', 'smoker'],
  });

  readonly availableStandardFields = computed(() => [
    { key: 'firstName', label: 'Imię' },
    { key: 'lastName', label: 'Nazwisko' },
    { key: 'pesel', label: 'PESEL' },
  ]);

  readonly currentUserName = computed(() => this.currentUser()?.name || 'Gość');

  login(email: string): boolean {
    const user = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
      return false;
    }

    this.currentUser.set(user);
    return true;
  }

  logout() {
    this.currentUser.set(null);
  }

  getPatientById(id: number): Patient | undefined {
    return this.patients().find((patient) => patient.id === id);
  }

  addPatient(patient: Partial<Patient>) {
    const nextId = Math.max(0, ...this.patients().map((item) => item.id)) + 1;
    this.patients.update((list) => [
      ...list,
      {
        id: nextId,
        firstName: patient.firstName?.trim() || 'Nowy',
        lastName: patient.lastName?.trim() || 'Pacjent',
        pesel: patient.pesel || '',
        customData: patient.customData || {},
        userId: this.currentUser()?.id ?? 1,
      },
    ]);
  }

  updatePatient(updatedPatient: Patient) {
    this.patients.update((list) =>
      list.map((patient) =>
        patient.id === updatedPatient.id ? { ...updatedPatient } : patient,
      ),
    );
  }

  addCustomField(field: Omit<CustomField, 'id'>) {
    const nextId =
      Math.max(0, ...this.customFields().map((item) => item.id)) + 1;
    this.customFields.update((list) => [
      ...list,
      {
        id: nextId,
        ...field,
      },
    ]);
  }

  removeCustomField(id: number) {
    this.customFields.update((list) => list.filter((field) => field.id !== id));
  }

  updatePdfConfig(config: Partial<UserPdfConfig>) {
    this.pdfConfig.update((current) => ({ ...current, ...config }));
  }

  getCustomFieldLabel(key: string): string {
    return this.customFields().find((field) => field.key === key)?.name || key;
  }

  downloadPatientPdf(patient: Patient) {
    const config = this.pdfConfig();

    const standardFieldsBody = config.selectedStandardFields.map((key) => {
      const label =
        this.availableStandardFields().find((item) => item.key === key)
          ?.label || key;
      const value = (patient as any)[key] ?? '-';
      return [{ text: label, bold: true }, { text: String(value) }];
    });

    const customFieldsBody = config.selectedCustomFieldKeys.map((key) => {
      const label = this.getCustomFieldLabel(key);
      const value = patient.customData?.[key] ?? '-';
      return [{ text: label, bold: true }, { text: String(value) }];
    });

    const docDefinition: any = {
      content: [
        { text: config.reportTitle, style: 'header' },
        {
          text: `Data wygenerowania: ${new Date().toLocaleDateString('pl-PL')}`,
          style: 'date',
        },

        { text: 'Dane podstawowe', style: 'sectionTitle' },
        {
          table: {
            widths: ['35%', '65%'],
            body: standardFieldsBody.length
              ? standardFieldsBody
              : [[{ text: 'Brak danych', colSpan: 2 }, '']],
          },
          layout: 'lightHorizontalLines',
        },

        {
          text: 'Dodatkowe pola',
          style: 'sectionTitle',
          margin: [0, 15, 0, 5],
        },
        {
          table: {
            widths: ['35%', '65%'],
            body: customFieldsBody.length
              ? customFieldsBody
              : [[{ text: 'Brak pól dodatkowych', colSpan: 2 }, '']],
          },
          layout: 'lightHorizontalLines',
        },
      ],

      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#1a365d',
          margin: [0, 0, 0, 5],
        },
        date: {
          fontSize: 9,
          color: '#718096',
          margin: [0, 0, 0, 15],
        },
        sectionTitle: {
          fontSize: 12,
          bold: true,
          color: '#2b6cb0',
          margin: [0, 10, 0, 5],
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    pdfMakeLib
      .createPdf(docDefinition)
      .download(`${patient.firstName}_${patient.lastName}_summary.pdf`);
  }
}
