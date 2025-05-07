import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private token = signal<string | null>(null);

  private _isLoggedIn = signal<boolean>(!!this.getToken());
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  login(credentials: { email: string; password: string }) {
    console.log(credentials);
    return this.http.post<{ accessToken: string }>(
      `${environment.apiUrl}/auth/login`,
      credentials
    );
  }

  register(data: { email: string; password: string }) {
    return this.http.post(`${environment.apiUrl}/auth/register`, data);
  }

  setToken(token: string) {
    this.token.set(token);
    localStorage.setItem('accessToken', token);
    this._isLoggedIn.set(true);
  }

  getToken(): string | null {
    return this.token() || localStorage.getItem('accessToken');
  }

  logout() {
    this.token.set(null);
    localStorage.removeItem('accessToken');
    this._isLoggedIn.set(false);
  }
}
