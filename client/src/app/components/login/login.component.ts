import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private router = inject(Router);
  private data = inject(MockDataService);

  email = 'doctor@patientmetrics.local';
  errorMessage = '';

  login() {
    this.errorMessage = '';
    const success = this.data.login(this.email.trim());
    if (!success) {
      this.errorMessage = 'Nie znaleziono użytkownika o takim adresie e-mail.';
      return;
    }

    this.router.navigate(['/patients']);
  }
}
