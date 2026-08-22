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
      .subscribe(({ data }) =>
        this.customFields.set(
          data.filter((field) => !this.isIgnoredField(field.name)),
        ),
      );
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

  toggleAllCustom() {
    const keys = this.customFields().map((field) => field.key);
    const selected = this.config().selectedCustomFieldKeys;
    const allSelected =
      keys.length > 0 && keys.every((key) => selected.includes(key));
    this.updateConfig({ selectedCustomFieldKeys: allSelected ? [] : keys });
  }

  allCustomSelected() {
    const keys = this.customFields().map((field) => field.key);
    return (
      keys.length > 0 &&
      keys.every((key) => this.config().selectedCustomFieldKeys.includes(key))
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
