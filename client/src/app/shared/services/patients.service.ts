import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Patient } from '@shared/models';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private readonly http = inject(HttpService);

  findAll(): Observable<ApiResponse<Patient[]>> {
    return this.http.get<Patient[]>('/patients');
  }

  findOne(id: number): Observable<ApiResponse<Patient>> {
    return this.http.get<Patient>(`/patients/${id}`);
  }

  create(
    patient: Omit<Patient, 'id' | 'userId'>,
  ): Observable<ApiResponse<Patient>> {
    return this.http.post<Patient>('/patients', patient);
  }

  update(
    id: number,
    patient: Partial<Patient>,
  ): Observable<ApiResponse<Patient>> {
    return this.http.patch<Patient>(`/patients/${id}`, patient);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<void>(`/patients/${id}`);
  }

  import(
    file: File,
  ): Observable<
    ApiResponse<{ imported: number; skipped: number; sheets: string[] }>
  > {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{
      imported: number;
      skipped: number;
      sheets: string[];
    }>('/patients/import', formData);
  }
}
