import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  standalone: true,
  selector: 'app-pdf-config',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pdf-config.component.html',
  styleUrls: ['./pdf-config.component.scss'],
})
export class PdfConfigComponent {
  router = inject(Router);
  data = inject(MockDataService);

  get config() {
    return this.data.pdfConfig();
  }

  toggleStandard(key: string) {
    const current = this.config.selectedStandardFields;
    const next = current.includes(key)
      ? current.filter((item) => item !== key)
      : [...current, key];
    this.data.updatePdfConfig({ selectedStandardFields: next });
  }

  toggleCustom(key: string) {
    const current = this.config.selectedCustomFieldKeys;
    const next = current.includes(key)
      ? current.filter((item) => item !== key)
      : [...current, key];
    this.data.updatePdfConfig({ selectedCustomFieldKeys: next });
  }

  save() {
    this.data.updatePdfConfig({ reportTitle: this.config.reportTitle });
  }
}
