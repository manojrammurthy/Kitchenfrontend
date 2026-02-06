import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

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
export class DailyMenuService {
    constructor(private http: HttpClient) { }

    getDailyMenu(): Observable<any> {
        return this.http.get<any>(INVENTORY_API + 'daily-menu/', httpOptions);
    }

    addDailyMenu(menuItem: any): Observable<any> {
        return this.http.post<any>(INVENTORY_API + 'daily-menu/', menuItem, httpOptions);
    }

    updateDailyMenu(id: number, menuData: any): Observable<any> {
        return this.http.put<any>(`${INVENTORY_API}daily-menu/${id}/`, menuData, httpOptions);
    }

    deleteDailyMenu(id: number): Observable<any> {
        return this.http.delete<any>(`${INVENTORY_API}daily-menu/${id}/`, httpOptions);
    }

    uploadDailyMenu(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(INVENTORY_API + 'daily-menu/upload-data/', formData);
    }

    calculateAvailability(menuId: number) {
        const params = new HttpParams().set('id', menuId.toString());
        return this.http.get<any>(
            `${INVENTORY_API}daily-menu/calculate-availability`,
            { params, ...httpOptions }
        );
    }

}