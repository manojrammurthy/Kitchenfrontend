import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MealSubscription } from '../models/food-item.model';
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
export class FoodItemService {
  private mockSubscriptions: MealSubscription[] = [];

  constructor(private http: HttpClient) { }

  getFoodItems(): Observable<any> {
    return this.http.get<any>(INVENTORY_API + 'food-items/', httpOptions);
  }

  getPreparationChoices(): Observable<{ key: string; label: string }[]> {
    return this.http.get<{ key: string; label: string }[]>(INVENTORY_API + 'food-items/preparation_choices/', httpOptions);
  }

  getMealChoices(): Observable<{ key: string; label: string }[]> {
    return this.http.get<{ key: string; label: string }[]>(
      INVENTORY_API + 'food-items/meal_choices/', httpOptions);
  }

  addFoodItem(item: any): Observable<any> {
    return this.http.post<any>(INVENTORY_API + 'food-items/', item, httpOptions);
  }
  updateFoodItem(item: any): Observable<any> {
    return this.http.put<any>(INVENTORY_API + 'food-items/' + item.id + '/', item, httpOptions);
  }
  deleteFoodItem(id: number): Observable<any> {
    return this.http.delete<any>(INVENTORY_API + 'food-items/' + id + '/', httpOptions);
  }

  uploadFoodMenu(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(INVENTORY_API + 'food-items/upload-data/', formData);
  }

}

// getFoodItems(): Observable<FoodItem[]> {
//   return of(this.mockFoodItems).pipe(delay(300));
// }

// addFoodItem(item: Omit<FoodItem, 'id'>): Observable<FoodItem> {
//   const newItem = {
//     ...item,
//     id: this.getNextFoodItemId()
//   } as FoodItem;

//   this.mockFoodItems.push(newItem);
//   return of(newItem).pipe(delay(300));
// }

// updateFoodItem(item: FoodItem): Observable<FoodItem> {
//   const index = this.mockFoodItems.findIndex(i => i.id === item.id);
//   if (index !== -1) {
//     this.mockFoodItems[index] = item;
//   }
//   return of(item).pipe(delay(300));
// }

// deleteFoodItem(id: number): Observable<boolean> {
//   const initialLength = this.mockFoodItems.length;
//   this.mockFoodItems = this.mockFoodItems.filter(item => item.id !== id);
//   return of(initialLength > this.mockFoodItems.length).pipe(delay(300));
// }

// getSubscriptions(employeeId?: number): Observable<MealSubscription[]> {
//   let subs = this.mockSubscriptions;
//   if (employeeId) {
//     subs = subs.filter(sub => sub.employeeId === employeeId);
//   }
//   return of(subs).pipe(delay(300));
// }

// addSubscription(sub: Omit<MealSubscription, 'id'>): Observable<MealSubscription> {
//   const newSub = {
//     ...sub,
//     id: this.getNextSubscriptionId(),
//     createdAt: new Date(),
//     updatedAt: new Date()
//   } as MealSubscription;

//   this.mockSubscriptions.push(newSub);
//   return of(newSub).pipe(delay(300));
// }

// updateSubscription(sub: MealSubscription): Observable<MealSubscription> {
//   const index = this.mockSubscriptions.findIndex(s => s.id === sub.id);
//   if (index !== -1) {
//     this.mockSubscriptions[index] = {
//       ...sub,
//       updatedAt: new Date()
//     };
//   }
//   return of(this.mockSubscriptions[index]).pipe(delay(300));
// }

// private getNextFoodItemId(): number {
//   return Math.max(...this.mockFoodItems.map(item => item.id), 0) + 1;
// }

// private getNextSubscriptionId(): number {
//   return Math.max(...this.mockSubscriptions.map(sub => sub.id), 0) + 1;
// }