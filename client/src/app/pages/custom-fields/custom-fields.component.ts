import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomFieldsService, ToastrService } from '@shared/services';
import { CustomField } from '@shared/models';

@Component({
  standalone: true,
  selector: 'app-custom-fields',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss'],
})
export class CustomFieldsComponent {
  router = inject(Router);
  private readonly fieldsService = inject(CustomFieldsService);
  private readonly toastr = inject(ToastrService);
  readonly customFields = signal<CustomField[]>([]);

  name = '';
  key = '';
  type: 'text' | 'number' | 'date' | 'boolean' = 'text';

  constructor() {
    this.fieldsService
      .findAll()
      .subscribe(({ data }) => this.customFields.set(data));
  }

  addField() {
    if (!this.name.trim() || !this.key.trim()) return;
    this.fieldsService
      .create({
        name: this.name.trim(),
        key: this.key.trim(),
        type: this.type,
      })
      .subscribe(({ data }) => {
        this.customFields.update((fields) => [...fields, data]);
        this.toastr.showSuccess('Pole zostało dodane.');
        this.name = '';
        this.key = '';
        this.type = 'text';
      });
  }

  remove(id: number) {
    this.fieldsService.delete(id).subscribe(() => {
      this.customFields.update((fields) =>
        fields.filter((field) => field.id !== id),
      );
      this.toastr.showSuccess('Pole zostało usunięte.');
    });
  }
}
