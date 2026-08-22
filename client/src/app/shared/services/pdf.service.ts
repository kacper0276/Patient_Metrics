import { Injectable, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CustomFieldsService } from './custom-fields.service';
import { PdfConfigService } from './pdf-config.service';
import { Patient, UserPdfConfig } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class PdfService {
  private readonly fieldsService = inject(CustomFieldsService);
  private readonly configService = inject(PdfConfigService);

  generate(patient: Patient): void {
    forkJoin({
      fields: this.fieldsService.findAll(),
      configs: this.configService.findAll(),
    }).subscribe(({ fields, configs }) => {
      void this.download(patient, fields.data, configs.data[0]);
    });
  }

  private async download(
    patient: Patient,
    fields: any[],
    savedConfig?: UserPdfConfig,
  ) {
    const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts'),
    ]);
    const pdfMakeLib = (pdfMake as any).default || pdfMake;
    const pdfFontsLib = (pdfFonts as any).default || pdfFonts;
    pdfMakeLib.vfs = pdfFontsLib?.pdfMake?.vfs || pdfFontsLib;

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
      { text: String((patient as any)[key] ?? '-') },
    ]);
    const customRows = config.selectedCustomFieldKeys.map((key) => {
      const field = fields.find((item) => item.key === key);
      return [
        { text: field?.name || key, bold: true },
        { text: String(patient.customData?.[key] ?? '-') },
      ];
    });

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
}
