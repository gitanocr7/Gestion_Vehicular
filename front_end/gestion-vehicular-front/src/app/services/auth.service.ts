
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = `${environment.apiUrl.replace(/\/+$/, '')}/login/`;
  private registerUrl = `${environment.apiUrl.replace(/\/+$/, '')}/registro/`;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap(response => {
        if (response?.success) {
          localStorage.setItem('user', JSON.stringify(response));
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getUser(): any {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  }

  getUsuarioActual(): any {
    return this.getUser();
  }

  isLoggedIn(): boolean {
    const user = this.getUser();
    return !!user?.id && !!user?.token;
  }

  getRole(): string {
    const user = this.getUser();
    return user?.rol?.toString().trim().toLowerCase() ?? '';
  }

  getToken(): string | null {
    const usuario = this.getUser();
    return usuario?.token ?? null;
  }
}
