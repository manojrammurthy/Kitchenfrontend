import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/role.model';
import { environment } from '../../environments/environment';

const INVENTORY_API = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = this.getAccessToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      })
    };
  }

  // Login and store everything in localStorage
  login(username: string, password: string, role: string): Observable<any> {
    return this.http.post<any>(`${INVENTORY_API}auth/login/`, { username, password, role })
      .pipe(
        tap(response => {
          const { access: accessToken, refresh: refreshToken, user } = response;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('currentUser', JSON.stringify(user));

          console.log("User logged in, token stored");
        })
      );
  }

  // Logout and clear all storage
  logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.http.post(`${INVENTORY_API}auth/logout/`, { refresh: refreshToken }).subscribe({
        next: () => console.log('Logged out on server'),
        error: err => console.error('Logout error', err),
      });
    }

    // Clear all authentication-related data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    console.log("All localStorage cleared on logout");
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Check if current user is admin
  isAdmin(): boolean {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return false;

    const stored = JSON.parse(userStr);
    const user: User | null = stored.user ?? null; // get the inner 'user' object

    return user?.role?.toLowerCase() === 'admin';
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    const stored = JSON.parse(userStr);
    return stored.user ?? null; // return the inner 'user' object
  }


  // Get tokens
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Fetch role choices
  getRoleChoices(): Observable<any[]> {
    return this.http.get<any[]>(`${INVENTORY_API}users/role_choices/`, this.getHttpOptions());
  }
}
