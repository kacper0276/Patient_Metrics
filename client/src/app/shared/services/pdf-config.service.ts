import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, UserPdfConfig } from '@shared/models';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class PdfConfigService {
  private readonly http = inject(HttpService);

  findAll(): Observable<ApiResponse<UserPdfConfig[]>> {
    return this.http.get<UserPdfConfig[]>('/user-pdf-config');
  }

  create(config: UserPdfConfig): Observable<ApiResponse<UserPdfConfig>> {
    return this.http.post<UserPdfConfig>('/user-pdf-config', config);
  }

  update(
    id: number,
    config: Partial<UserPdfConfig>,
  ): Observable<ApiResponse<UserPdfConfig>> {
    return this.http.patch<UserPdfConfig>(`/user-pdf-config/${id}`, config);
  }
}
