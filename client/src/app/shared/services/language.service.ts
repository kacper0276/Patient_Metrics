import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguage$ = new BehaviorSubject<string>('pl');
  private readonly storageKey = 'selectedLanguage';
  private readonly defaultLanguage = 'pl';

  constructor(private translateService: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Pobierz język z localStorage lub użyj domyślnego
    const savedLanguage =
      localStorage.getItem(this.storageKey) || this.defaultLanguage;
    this.setLanguage(savedLanguage);
  }

  setLanguage(language: string): void {
    this.translateService.use(language);
    this.currentLanguage$.next(language);
    localStorage.setItem(this.storageKey, language);
  }

  getCurrentLanguage(): Observable<string> {
    return this.currentLanguage$.asObservable();
  }

  getCurrentLanguageValue(): string {
    return this.currentLanguage$.value;
  }

  getAvailableLanguages(): string[] {
    return ['en', 'pl'];
  }

  getLanguageName(lang: string): string {
    const names: { [key: string]: string } = {
      en: 'English',
      pl: 'Polski',
    };
    return names[lang] || lang;
  }
}
