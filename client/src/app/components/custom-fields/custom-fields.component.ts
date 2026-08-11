import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  standalone: true,
  selector: 'app-custom-fields',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss'],
})
export class CustomFieldsComponent {
  router = inject(Router);
  data = inject(MockDataService);

  name = '';
  key = '';
  type: 'text' | 'number' | 'date' | 'boolean' = 'text';

  addField() {
    if (!this.name.trim() || !this.key.trim()) return;
    this.data.addCustomField({
      name: this.name.trim(),
      key: this.key.trim(),
      type: this.type,
      userId: this.data.currentUser()?.id ?? 1,
    });
    this.name = '';
    this.key = '';
    this.type = 'text';
  }

  remove(id: number) {
    this.data.removeCustomField(id);
  }
}
