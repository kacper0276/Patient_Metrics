import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services';
import { ToastrService } from '@shared/services';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private toastr = inject(ToastrService);

  email = 'doctor@patientmetrics.local';
  password = 'Doctor123!';
  errorMessage = '';

  login() {
    this.errorMessage = '';
    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.toastr.showSuccess('Zalogowano pomyślnie.');
        void this.router.navigate(['/patients']);
      },
      error: () => {
        this.errorMessage = 'Nie udało się zalogować.';
      },
    });
  }
}
