import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="language-switcher">
      <button
        *ngFor="let lang of availableLanguages"
        [class.active]="currentLanguage === lang"
        (click)="switchLanguage(lang)"
        class="lang-btn"
        [title]="'common.language' | translate"
      >
        {{ getLanguageName(lang) }}
      </button>
    </div>
  `,
  styles: [
    `
      .language-switcher {
        display: flex;
        gap: 6px;
        align-items: center;
        margin-left: auto;
        padding-left: 1rem;
        border-left: 1px solid rgba(148, 163, 184, 0.22);
      }

      .lang-btn {
        padding: 6px 10px;
        border: 1px solid rgba(148, 163, 184, 0.4);
        background-color: transparent;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.25s ease;
        color: #475569;

        &:hover {
          border-color: #2563eb;
          background-color: rgba(37, 99, 235, 0.08);
          color: #1d4ed8;
        }

        &.active {
          border-color: #2563eb;
          background-color: rgba(37, 99, 235, 0.16);
          color: #1d4ed8;
          font-weight: 600;
        }
      }

      @media (max-width: 900px) {
        .language-switcher {
          margin-left: 0;
          border-left: none;
          padding-left: 0;
        }
      }
    `,
  ],
})
export class LanguageSwitcherComponent implements OnInit {
  private readonly languageService = inject(LanguageService);

  availableLanguages: string[] = [];
  currentLanguage: string = 'pl';

  ngOnInit(): void {
    this.availableLanguages = this.languageService.getAvailableLanguages();
    this.languageService.getCurrentLanguage().subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  switchLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }

  getLanguageName(lang: string): string {
    return this.languageService.getLanguageName(lang);
  }
}
