import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '@shared/models';
import { User } from '@shared/models';
import { HttpService } from './http.service';
import { LocalStorageService } from './local-storage.service';

export interface AuthResult {
  accessToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpService);
  private readonly storage = inject(LocalStorageService);
  private readonly tokenKey = 'patient-metrics-token';
  private readonly userKey = 'patient-metrics-user';

  login(email: string, password: string): Observable<ApiResponse<AuthResult>> {
    return this.http.post<AuthResult>('/auth/login', { email, password }).pipe(
      tap(({ data }) => {
        this.storage.setItem(this.tokenKey, data.accessToken);
        this.storage.setItem(this.userKey, data.user);
      }),
    );
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
    this.storage.removeItem(this.userKey);
  }

  get token(): string | null {
    return this.storage.getItem<string>(this.tokenKey);
  }

  get currentUser(): User | null {
    return this.storage.getItem<User>(this.userKey);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }
}
