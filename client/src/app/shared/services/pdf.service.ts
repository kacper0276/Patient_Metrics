import { Injectable, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CustomFieldsService } from './custom-fields.service';
import { PdfConfigService } from './pdf-config.service';
import { ToastrService } from './toastr.service';
import { Patient, UserPdfConfig } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class PdfService {
  private readonly fieldsService = inject(CustomFieldsService);
  private readonly configService = inject(PdfConfigService);
  private readonly toastr = inject(ToastrService);

  generate(patient: Patient): void {
    forkJoin({
      fields: this.fieldsService.findAll(),
      configs: this.configService.findAll(),
    }).subscribe({
      next: ({ fields, configs }) => {
        void this.download(patient, fields.data, configs.data[0]).catch(() => {
          this.toastr.showError('Nie udało się wygenerować pliku PDF.');
        });
      },
      error: () => this.toastr.showError('Nie udało się pobrać danych do PDF.'),
    });
  }

  private async download(
    patient: Patient,
    fields: any[],
    savedConfig?: UserPdfConfig,
  ) {
    const [pdfMakeModule, pdfFontsModule] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts'),
    ]);
    const pdfMakeLib = (pdfMakeModule as any).default || (pdfMakeModule as any);
    const pdfFontsLib =
      (pdfFontsModule as any).default || (pdfFontsModule as any);
    const virtualFileSystem =
      pdfFontsLib?.pdfMake?.vfs || pdfFontsLib?.vfs || pdfFontsLib;
    if (typeof pdfMakeLib.addVirtualFileSystem === 'function') {
      pdfMakeLib.addVirtualFileSystem(virtualFileSystem);
    } else {
      pdfMakeLib.vfs = virtualFileSystem;
    }
    if (typeof pdfMakeLib.createPdf !== 'function') {
      throw new Error('pdfMake is not available');
    }

    const config = savedConfig ?? {
      reportTitle: 'Podsumowanie pacjenta',
      selectedStandardFields: ['firstName', 'lastName', 'pesel'],
      selectedCustomFieldKeys: fields.map((field) => field.key),
    };
    const standardLabels: Record<string, string> = {
      firstName: 'Imię',
      lastName: 'Nazwisko',
      pesel: 'PESEL',
    };
    const standardRows = config.selectedStandardFields.map((key) => [
      { text: standardLabels[key] || key, bold: true },
      { text: this.formatValue((patient as any)[key]) },
    ]);
    const customRows = config.selectedCustomFieldKeys
      .map((key) => {
        const field = fields.find((item) => item.key === key);
        if (
          !field ||
          this.isIgnoredField(field.name) ||
          !Object.prototype.hasOwnProperty.call(patient.customData || {}, key)
        ) {
          return null;
        }
        return [
          { text: field.name, bold: true },
          { text: this.formatValue(patient.customData[key]) },
        ];
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);

    pdfMakeLib
      .createPdf({
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
              body: standardRows.length
                ? standardRows
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
              body: customRows.length
                ? customRows
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
          date: { fontSize: 9, color: '#718096', margin: [0, 0, 0, 15] },
          sectionTitle: {
            fontSize: 12,
            bold: true,
            color: '#2b6cb0',
            margin: [0, 10, 0, 5],
          },
        },
        defaultStyle: { fontSize: 10 },
      })
      .download(`${patient.firstName}_${patient.lastName}_summary.pdf`);
  }

  private formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'number') {
      return value.toLocaleString('pl-PL', { maximumFractionDigits: 2 });
    }
    return String(value);
  }

  private isIgnoredField(name: string): boolean {
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
