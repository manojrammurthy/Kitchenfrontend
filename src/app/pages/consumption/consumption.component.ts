import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { MealConsumption, MealType } from '../../models/employee.model';
import { LocationService } from '../../services/location.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consumption',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container fade-in">
      <h2>Consumption Tracking</h2>
      <div class="form-group location-select">
        <select
          id="location"
          class="form-control"
          [(ngModel)]="selectedServingLocationId"
          name="location"
        >
          <option [ngValue]="null">All Locations</option>
          <option *ngFor="let location of servingLocations" [ngValue]="location.id">
            {{ location.name }}
          </option>
        </select>
      </div>
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">🍳</div>
          <div class="stat-content">
            <h3>Today's Meals</h3>
            <p class="stat-value">{{ getTotalCount() }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Total Cost</h3>
            <p class="stat-value">{{ getTotalCost() | currency:'INR':'symbol' }}</p>
          </div>
        </div>
      </div>

      <div class="consumption-table">
        <h3>Recent Consumption</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Meal Type</th>
              <th>Guest</th>
              <th>Date & Time</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let meal of getFilteredMeals()">
              <td>{{ meal.employee.full_name }}</td>
              <td>{{ meal.meal_type }}</td>
              <td>{{ meal.additional_people}}</td>
              <td>{{ meal.date | date:'medium' }}</td>
              <td>{{ meal.rate | currency:'INR':'symbol' }}</td>
            </tr>
            <tr *ngIf="getFilteredMeals().length === 0">
              <td colspan="4" class="empty-message">No consumption records found</td>
            </tr>
            <!-- <tr *ngIf="todayMeals.length === 0">
              <td colspan="4" class="empty-message">No consumption records found</td>
            </tr> -->
          </tbody>
        </table>
      </div>

      <div class="meal-distribution">
        <h3>Meal Distribution</h3>
        <div class="distribution-grid">
          <div class="meal-type-card" *ngFor="let type of mealTypes">
            <h4>{{ type }}</h4>
            <p class="count">{{ getMealTypeCount(type) }}</p>
            <p class="total">{{ getMealTypeCost(type) | currency:'INR':'symbol' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: var(--space-3);
      max-width: 100%;
      margin: 0 auto;
    }

    .location-select{
      width: 200px;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .stat-card {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-3);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      box-shadow: var(--shadow-sm);
    }

    .stat-icon {
      font-size: 2rem;
      background: var(--primary-50);
      color: var(--primary-700);
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
    }

    .stat-content h3 {
      font-size: 0.875rem;
      color: var(--neutral-600);
      margin: 0;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .consumption-table {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-3);
      margin-bottom: var(--space-4);
      box-shadow: var(--shadow-sm);
    }

    .empty-message {
      text-align: center;
      padding: var(--space-3);
      color: var(--neutral-500);
    }

    .meal-distribution {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-3);
      box-shadow: var(--shadow-sm);
    }

    .distribution-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-3);
      margin-top: var(--space-3);
    }

    .meal-type-card {
      background: var(--neutral-50);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      text-align: center;
    }

    .meal-type-card h4 {
      margin: 0 0 var(--space-2) 0;
      color: var(--neutral-700);
    }

    .count {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 var(--space-1) 0;
      color: var(--primary-600);
    }

    .total {
      color: var(--neutral-600);
      margin: 0;
    }
  `]
})
export class ConsumptionComponent implements OnInit {
  recentMeals: any[] = [];       // Keep using `any` if you don’t want to model
  todayMeals: any[] = [];
  servingLocations: any[] = [];  // ← Store serving location data here
  mealTypes = Object.values(MealType);
  selectedServingLocationId: number | null = null;

  constructor(private employeeService: EmployeeService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.loadConsumptionData();
    this.loadServingLocations();  // ← load serving locations on init
  }

  loadConsumptionData(): void {
    this.employeeService.getMealConsumptions().subscribe(meals => {

      this.recentMeals = meals.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.todayMeals = meals.filter(meal => {
        const mealDate = new Date(meal.date);
        mealDate.setHours(0, 0, 0, 0);
        return mealDate.getTime() === today.getTime();
      });

    });
  }


  loadServingLocations(): void {
    this.locationService.getServingLocations().subscribe(
      data => {
        this.servingLocations = data;
      },
      error => {
        console.error('Failed to load serving locations:', error);
      }
    );
  }

  getTotalCost(): number {
    return this.getFilteredMeals().reduce((total, meal) => {
      const rate = typeof meal.rate === 'number' ? meal.rate : parseFloat(meal.rate as any) || 0;
      return total + rate;
    }, 0);
  }

  getTotalCount(): number {
    return this.getFilteredMeals().reduce((total, meal) => {
      const extra = Array.isArray(meal.additional_people) ? meal.additional_people.length : 0;
      return total + 1 + extra; // 1 for the employee
    }, 0);
  }

  getMealTypeCount(type: MealType): number {
    return this.getFilteredMeals().reduce((total, meal) => {
      if (meal.meal_type?.toLowerCase() === type.toLowerCase()) {
        const extra = Array.isArray(meal.additional_people) ? meal.additional_people.length : 0;
        return total + 1 + extra; // 1 for the employee
      }
      return total;
    }, 0);
  }

  getMealTypeCost(type: MealType): number {
    return this.getFilteredMeals()
      .filter(meal => meal.meal_type?.toLowerCase() === type.toLowerCase())
      .reduce((total, meal) => {
        const rate = typeof meal.rate === 'number' ? meal.rate : parseFloat(meal.rate as any) || 0;
        return total + rate;
      }, 0);
  }

  getFilteredMeals(): any[] {
    if (!this.selectedServingLocationId) return this.todayMeals;
    return this.todayMeals.filter(
      meal => meal.consumption_location?.id === this.selectedServingLocationId
    );
  }
}
