import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, CustomField } from '@shared/models';
import { FieldType } from '@shared/types/field.type';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class CustomFieldsService {
  private readonly http = inject(HttpService);

  findAll(): Observable<ApiResponse<CustomField[]>> {
    return this.http.get<CustomField[]>('/custom-fields');
  }

  create(field: {
    name: string;
    key: string;
    type: FieldType;
  }): Observable<ApiResponse<CustomField>> {
    return this.http.post<CustomField>('/custom-fields', field);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<void>(`/custom-fields/${id}`);
  }
}
