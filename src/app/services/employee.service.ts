import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Employee, MealConsumption, MealType } from '../models/employee.model';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MasterRecordService, SpecialPrice } from './master.record.service';
import { firstValueFrom } from 'rxjs';


const INVENTORY_API = environment.apiUrl;

const token = localStorage.getItem('accessToken');
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
};

const httpOptions1 = {
  headers: new HttpHeaders({
    'Authorization': `Bearer ${token}`
  })
};

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeeData: Employee[] = [];
  private mockConsumptions: MealConsumption[] = [
  ];

  constructor(private http: HttpClient,
    private masterRecordService: MasterRecordService
  ) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<any>(INVENTORY_API + 'employees/', httpOptions);
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(INVENTORY_API + 'employees/', employee, httpOptions);
  }

  updateEmployee(updatedEmployee: Employee): Observable<Employee> {
    return this.http.put<Employee>(INVENTORY_API + 'employees/' + updatedEmployee.id + '/', updatedEmployee, httpOptions);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(INVENTORY_API + 'employees/' + id + '/', httpOptions);
  }

  uploadCSV(fileData: FormData) {
    return this.http.post<any>(INVENTORY_API + 'employees/upload-csv/', fileData, httpOptions1);
  }

  // Meal Consumption Methods
  getMealConsumptions(): Observable<any[]> {
    return this.http.get<any>(INVENTORY_API + 'meal-tracker/', httpOptions);
  }

  // getEmployeeMealConsumptions(employeeId: number): Observable<MealConsumption[]> {
  //   return this.http.get<MealConsumption[]>(INVENTORY_API + `consumption/?employee_id=${employeeId}`, httpOptions);
  // }

  getMonthlySummary(employeeId: number, month: number, year: number): Observable<any> {
    const url = `${INVENTORY_API}consumption/?employee_id=${employeeId}&month=${month}&year=${year}`;
    return this.http.get<any>(url, httpOptions);
  }

  addMealConsumption(payload: any): Observable<any> {
    return this.http.post<any>(INVENTORY_API + 'meal-tracker/', payload, httpOptions);
  }


  editMealConsumption(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${INVENTORY_API}meal-tracker/${id}/`, payload, httpOptions);
  }


  deleteMealConsumption(consumption: any): Observable<any> {
    return this.http.delete(`${INVENTORY_API}meal-tracker/${consumption.id}/`, httpOptions);
  }

  getEmployeesMT(locationId?: number): Observable<Employee[]> {
    let url = INVENTORY_API + 'employees/mealtracker-data/';
    if (locationId) {
      url += `?location_id=${locationId}`;
    }
    return this.http.get<Employee[]>(url, httpOptions);
  }


  async calculateMealRate(date: Date, mealType: MealType, guestCount: number = 0): Promise<number> {
    let baseRate = 0;

    try {
      const specialRates: SpecialPrice[] = await firstValueFrom(this.masterRecordService.getSpecialLunchRate());

      const formattedDate = date.toISOString().split('T')[0]; // e.g., '2025-07-08'

      const matchedSpecial = specialRates.find(entry => {
        const entryDate = new Date(entry.date).toISOString().split('T')[0];
        return entryDate === formattedDate;
      });

      if (mealType === MealType.LUNCH && matchedSpecial) {
        baseRate = matchedSpecial.rate;
      } else {
        const day = date.getDay();
        const isSpecialDay = day === 3 || day === 5;

        switch (mealType) {
          case MealType.BREAKFAST:
            baseRate = 6.0;
            break;
          case MealType.LUNCH:
            baseRate = isSpecialDay ? 120.0 : 80.0;
            break;
          case MealType.SNACK:
            baseRate = 2.0;
            break;
          case MealType.DINNER:
            baseRate = 12.0;
            break;
        }
      }
    } catch (error) {
      console.error('Error fetching special lunch rates:', error);
      if (mealType === MealType.LUNCH) {
        const day = date.getDay();
        baseRate = (day === 3 || day === 5) ? 120.0 : 80.0;
      }
    }

    const totalPeople = 1 + guestCount;
    return baseRate * totalPeople;
  }

  recordEmployeeSignIn(employeeId: number): Observable<Employee | undefined> {
    const index = this.employeeData.findIndex(emp => emp.id === employeeId);

    if (index !== -1) {
      this.employeeData[index] = {
        ...this.employeeData[index],
        last_sign_in: new Date()
      };

      return of(this.employeeData[index]).pipe(delay(300));
    }

    return of(undefined).pipe(delay(300));
  }

  getMonthlyConsumptionReport(month: number, year: number): Observable<MealConsumption[]> {
    return this.getMealConsumptions().pipe(
      map(consumptions => {
        return consumptions.filter(consumption => {
          const consumptionDate = new Date(consumption.date);
          return consumptionDate.getMonth() === month && consumptionDate.getFullYear() === year;
        });
      })
    );
  }

  getConsumptionReport(startDate: Date, endDate: Date): Observable<MealConsumption[]> {
    return this.getMealConsumptions().pipe(
      map(consumptions => {
        return consumptions.filter(consumption => {
          const consumptionDate = new Date(consumption.date);
          return consumptionDate >= startDate && consumptionDate <= endDate;
        });
      })
    );
  }
}