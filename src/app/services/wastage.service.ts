import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Wastage, WastageReason } from '../models/wastage.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
export class WastageService {
  constructor(private http: HttpClient) { }

  getWastageItems(): Observable<any[]> {
    return this.http.get<any[]>(INVENTORY_API + 'kitchen-wastage/', httpOptions);
  }

  getFoodItems(): Observable<any[]> {
    return this.http.get<any[]>(INVENTORY_API + 'food-items/', httpOptions);
  }

  getKitchenLocation(): Observable<any[]> {
    return this.http.get<any[]>(INVENTORY_API + 'kitchen-locations/', httpOptions);
  }

  // getWastageItem(id: number): Observable<Wastage | undefined> {
  //   const item = this.mockWastage.find(item => item.id === id);
  //   return of(item).pipe(delay(300));
  // }

  getKitchenWastage(): Observable<any[]> {
    return this.http.get<any[]>(INVENTORY_API + 'kitchen-wastage', httpOptions)
  }

  getWastageDropdownOptions(): Observable<any[]> {
    return this.http.get<any[]>(
      INVENTORY_API + 'kitchen-wastage/kitchen_wastage_options/', httpOptions
    );
  }

  addWastage(payload: any): Observable<any> {
    return this.http.post<any>(INVENTORY_API + 'kitchen-wastage/', payload, httpOptions);
  }

  updateWastage(id: number, payload: any): Observable<any> {
    return this.http.put(INVENTORY_API + 'kitchen-wastage/' + id + '/', payload, httpOptions);
  }


  // updateWastageItem(id: number, updatedItem: Wastage): Observable<Wastage> {
  //   const index = this.mockWastage.findIndex(item => item.id === updatedItem.id);

  //   if (index !== -1) {
  //     this.mockWastage[index] = updatedItem;
  //   }

  //   return of(this.mockWastage[index]).pipe(delay(300));
  // }

  // deleteWastageItem(id: number): Observable<boolean> {
  //   const initialLength = this.mockWastage.length;
  //   this.mockWastage = this.mockWastage.filter(item => item.id !== id);

  //   return of(initialLength > this.mockWastage.length).pipe(delay(300));
  // }

  // getWastageByReason(): Observable<{ reason: WastageReason; count: number; cost: number }[]> {
  //   const wastageByReason = Object.values(WastageReason).map(reason => {
  //     const items = this.mockWastage.filter(item => item.reason === reason);
  //     const count = items.length;
  //     const cost = items.reduce((total, item) => total + item.cost, 0);

  //     return { reason, count, cost };
  //   });

  //   return of(wastageByReason).pipe(delay(300));
  // }

  // getWastageByDateRange(startDate: Date, endDate: Date): Observable<Wastage[]> {
  //   const filteredWastage = this.mockWastage.filter(item => {
  //     const itemDate = new Date(item.wastage_date);
  //     return itemDate >= startDate && itemDate <= endDate;
  //   });

  //   return of(filteredWastage).pipe(delay(300));
  // }

  // getMonthlyWastageReport(month: number, year: number): Observable<Wastage[]> {
  //   return this.getWastageItems().pipe(
  //     map(items => {
  //       return items.filter(item => {
  //         const wastageDate = new Date(item.date);
  //         return wastageDate.getMonth() === month && wastageDate.getFullYear() === year;
  //       });
  //     })
  //   );
  // }

  // getWastageReport(startDate: Date, endDate: Date): Observable<Wastage[]> {
  //   return this.getWastageItems().pipe(
  //     map(items => {
  //       return items.filter(item => {
  //         const wastageDate = new Date(item.date);
  //         return wastageDate >= startDate && wastageDate <= endDate;
  //       });
  //     })
  //   );
  // }

  // getInventoryWastageOptions(): Observable<{ units: any[]; reasons: any[] }> {
  //   return this.http.get<{ units: any[]; reasons: any[] }>('http://localhost:8000/api/inventory-wastage/options/');
  // }


  // private getNextId(): number {
  //   const maxId = Math.max(...this.mockWastage.map(item => item.id), 0);
  //   return maxId + 1;
  // }
}