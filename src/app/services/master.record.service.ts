import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const INVENTORY_API = environment.apiUrl;

const token = localStorage.getItem('accessToken');
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
};

export interface Category {
  category: string;
}

export interface InventoryItemName {
  name: string;
  kitchen_location: string;
  is_active?: boolean;
}

export interface SpecialPrice {
  date: string;
  rate: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterRecordService {
  constructor(private http: HttpClient) { }

  // INVENTORY ITEM NAME
  getInventoryItemName(): Observable<any[]> {
    return this.http.get<any>(INVENTORY_API + 'inventory-item-name/', httpOptions);
  }
  uploadInventoryItemName(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(INVENTORY_API + 'inventory-item-name/upload-data/', formData);
  }
  addInventoryItem(InventoryItemName: InventoryItemName): Observable<Category> {
    return this.http.post<Category>(INVENTORY_API + 'inventory-item-name/', InventoryItemName, httpOptions);
  }
  updateInventoryItem(id: number, category: { name: string }): Observable<any> {
    return this.http.put(`${INVENTORY_API}inventory-item-name/${id}/`, category, httpOptions);
  }
  deleteInventoryItem(id: number): Observable<void> {
    return this.http.delete<void>(`${INVENTORY_API}inventory-item-name/${id}/`, httpOptions);
  }

  // CATEGORY
  getCategories(): Observable<any[]> {
    return this.http.get<any>(INVENTORY_API + 'category/', httpOptions);
  }
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(INVENTORY_API + 'category/', category, httpOptions);
  }
  updateCategory(id: number, category: { category: string }): Observable<any> {
    return this.http.put(`${INVENTORY_API}category/${id}/`, category, httpOptions);
  }
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${INVENTORY_API}category/${id}/`, httpOptions);
  }

  //SPECIAL PRICE LIST
  getSpecialLunchRate(): Observable<any[]> {
    return this.http.get<any[]>(INVENTORY_API + 'special-lunch-rate/', httpOptions);
  }

  addSpecialLunchRate(rate: { date: string; rate: number, description: string }): Observable<any> {
    return this.http.post<any>(INVENTORY_API + 'special-lunch-rate/', rate, httpOptions);
  }

  updateSpecialLunchRate(id: number, rate: { date: string; rate: number, description: string }): Observable<any> {
    return this.http.put<any>(`${INVENTORY_API}special-lunch-rate/${id}/`, rate, httpOptions);
  }

  deleteSpecialLunchRate(id: number): Observable<void> {
    return this.http.delete<void>(`${INVENTORY_API}special-lunch-rate/${id}/`, httpOptions);
  }
}



