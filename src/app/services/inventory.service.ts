import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem } from '../models/inventory-item.model';
import { environment } from '../../environments/environment';

const INVENTORY_API = environment.apiUrl;

const token = localStorage.getItem('accessToken');
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
};
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  getInventoryItems(): Observable<any[]> {
    return this.http.get<any>(INVENTORY_API + 'inventory/', httpOptions);
  }

  getInventoryItem(id: number): Observable<[]> {
    return this.http.get<any>(INVENTORY_API + 'inventory/' + id + '/', httpOptions);
  }
  getLowItems(): Observable<any[]> {
    return this.http.get<any[]>(`${INVENTORY_API}inventory/low_stock/`);
  }
  getExpiringSoonItems(): Observable<any[]> {
    return this.http.get<any[]>(`${INVENTORY_API}inventory/expiring_soon/`);
  }

  addInventoryItem(item: any): Observable<any> {
    return this.http.post<any>(INVENTORY_API + 'inventory/', item, httpOptions);
  }

  updateInventoryItem(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${INVENTORY_API}inventory/${id}/`, item, httpOptions);
  }

  updateInventoryExpiryDate(id: number, no_days: number): Observable<any> {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('no_days', no_days.toString());

    const options = {
      ...httpOptions,
      params: params
    };

    return this.http.get<any>(`${INVENTORY_API}inventory/extend_expiry/`, options);
  }

  deleteInventoryItem(id: number): Observable<void> {
    return this.http.delete<void>(INVENTORY_API + 'inventory/' + id + '/', httpOptions);
  }
  uploadInventoryItem(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(INVENTORY_API + 'inventory/upload-data/', formData);
  }
  exportInventory(month?: string, year?: string, location?: string): Observable<Blob> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;
    if (location) params.location = location;
    console.log(params);


    return this.http.get(INVENTORY_API + 'export-inventory/', {
      params,
      responseType: 'blob'
    });
  }


  getInventoryWastage(): Observable<any[]> {
    return this.http.get<any[]>(
      INVENTORY_API + 'inventory-wastage/', httpOptions
    )
  }

  getWastageDropdownOptions(): Observable<any[]> {
    return this.http.get<any[]>(
      INVENTORY_API + 'inventory-wastage/inventory_wastage_options/', httpOptions
    );
  }

  updateWastage(id: number, payload: any): Observable<any> {
    return this.http.put(INVENTORY_API + 'inventory-wastage/' + id + '/', payload, httpOptions);
  }

  recordWastage(payload: any): Observable<any> {
    return this.http.post(`${INVENTORY_API}inventory-wastage/`, payload, httpOptions);
  }

  deleteInventoryWastage(id: number): Observable<void> {
    return this.http.delete<void>(INVENTORY_API + 'inventory-wastage/' + id + '/', httpOptions);
  }


  getLowStockItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(INVENTORY_API + 'low-stock/', httpOptions);
  }

  getExpiringItems(daysThreshold: number = 7): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(INVENTORY_API + 'expiring/', {
      ...httpOptions,
      params: { days: daysThreshold.toString() }
    });
  }

  getMonthlyReport(month: number, year: number): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(INVENTORY_API + 'monthly-report/', {
      ...httpOptions,
      params: { month: month.toString(), year: year.toString() }
    });
  }

  getInventoryReport(startDate: Date, endDate: Date): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(INVENTORY_API + 'report/', {
      ...httpOptions,
      params: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });
  }
}
