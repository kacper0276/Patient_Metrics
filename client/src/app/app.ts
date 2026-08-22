import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { ToastrComponent } from './shared/components/toastr/toastr.component';
import { AuthService, ToastrService } from './shared/services';

@Component({
  selector: 'app-root',
  imports: [NgIf, RouterOutlet, RouterLink, SpinnerComponent, ToastrComponent],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <div>
          <span class="brand">Patient Metrics</span>
        </div>
        <nav class="nav-links">
          <a *ngIf="!isAuthenticated" routerLink="/login">Logowanie</a>
          <a routerLink="/patients">Pacjenci</a>
          <a routerLink="/fields">Pola</a>
          <a routerLink="/config">Konfiguracja</a>
          <button *ngIf="isAuthenticated" type="button" (click)="logout()">
            Wyloguj
          </button>
        </nav>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      <app-spinner></app-spinner>
      <app-toastr></app-toastr>
    </div>
  `,
  styleUrls: ['./app.scss'],
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  protected title = 'Patient Metrics';

  get isAuthenticated() {
    return this.auth.isAuthenticated;
  }

  logout() {
    this.auth.logout();
    this.toastr.showInfo('Wylogowano.');
    void this.router.navigate(['/login']);
  }
}
