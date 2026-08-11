import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <div>
          <span class="brand">Patient Metrics</span>
        </div>
        <nav class="nav-links">
          <a routerLink="/login">Logowanie</a>
          <a routerLink="/patients">Pacjenci</a>
          <a routerLink="/fields">Pola</a>
          <a routerLink="/config">Konfiguracja</a>
        </nav>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./app.scss'],
})
export class App {
  protected title = 'Patient Metrics';
}
