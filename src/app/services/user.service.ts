import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const INVENTORY_API = environment.apiUrl;

const token = localStorage.getItem('accessToken');
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
};

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any[]>(`${INVENTORY_API}users/`, httpOptions);
  }

  createUser(data: any) {
    return this.http.post(`${INVENTORY_API}users/`, data, httpOptions);
  }

  updateUser(id: number, data: any) {
    return this.http.put(`${INVENTORY_API}users/${id}/`, data, httpOptions);
  }

  resetPassword(id: number, password: string) {
    return this.http.post(`${INVENTORY_API}users/${id}/reset_password/`, { password }, httpOptions);
  }
}
