import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  CustomFieldsService,
  PdfConfigService,
  ToastrService,
} from '@shared/services';
import { CustomField, UserPdfConfig } from '@shared/models';

@Component({
  standalone: true,
  selector: 'app-pdf-config',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pdf-config.component.html',
  styleUrls: ['./pdf-config.component.scss'],
})
export class PdfConfigComponent {
  router = inject(Router);
  private readonly configService = inject(PdfConfigService);
  private readonly fieldsService = inject(CustomFieldsService);
  private readonly toastr = inject(ToastrService);
  readonly customFields = signal<CustomField[]>([]);
  readonly availableStandardFields = [
    { key: 'firstName', label: 'Imię' },
    { key: 'lastName', label: 'Nazwisko' },
    { key: 'pesel', label: 'PESEL' },
  ];
  config = signal<UserPdfConfig>({
    reportTitle: 'Podsumowanie pacjenta',
    selectedStandardFields: ['firstName', 'lastName', 'pesel'],
    selectedCustomFieldKeys: [],
  });
  private configId?: number;

  constructor() {
    this.fieldsService
      .findAll()
      .subscribe(({ data }) => this.customFields.set(data));
    this.configService.findAll().subscribe(({ data }) => {
      const config = data[0];
      if (config) {
        this.configId = config.id;
        this.config.set({ ...config });
      }
    });
  }

  updateConfig(update: Partial<UserPdfConfig>) {
    this.config.update((current) => ({ ...current, ...update }));
  }

  toggleStandard(key: string) {
    const current = this.config().selectedStandardFields;
    const next = current.includes(key)
      ? current.filter((item) => item !== key)
      : [...current, key];
    this.updateConfig({ selectedStandardFields: next });
  }

  toggleCustom(key: string) {
    const current = this.config().selectedCustomFieldKeys;
    const next = current.includes(key)
      ? current.filter((item) => item !== key)
      : [...current, key];
    this.updateConfig({ selectedCustomFieldKeys: next });
  }

  save() {
    const config = this.config();
    const request = this.configId
      ? this.configService.update(this.configId, config)
      : this.configService.create(config);
    request.subscribe(({ data }) => {
      this.configId = data.id;
      this.config.set({ ...data });
      this.toastr.showSuccess('Konfiguracja została zapisana.');
    });
  }
}
