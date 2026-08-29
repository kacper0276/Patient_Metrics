import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  provideTranslateService,
  TranslateLoader,
  TranslationObject,
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { routes } from './app.routes';
import { apiInterceptor } from './shared/interceptors/api.interceptor';

class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    return this.http.get<TranslationObject>(`./assets/i18n/${lang}.json`);
  }
}

export function CustomTranslateLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: CustomTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
};
