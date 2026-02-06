import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container fade-in">
      <h2>Meal Subscriptions</h2>
      <div class="subscription-grid">
        <div class="subscription-card" *ngFor="let employee of employees">
          <div class="employee-info">
            <img [src]="employee.profile_image || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                 [alt]="employee.user.first_name + ' ' + employee.user.last_name"
                 class="employee-avatar">
            <h3>{{ employee.user.first_name }} {{ employee.user.last_name }}</h3>
            <p>{{ employee.department }}</p>
          </div>
          
          <div class="meal-options">
            <div class="meal-type">
              <label>
                <input type="checkbox" [(ngModel)]="employee.subscriptions.breakfast">
                Breakfast
              </label>
            </div>
            <div class="meal-type">
              <label>
                <input type="checkbox" [(ngModel)]="employee.subscriptions.lunch">
                Lunch
              </label>
            </div>
            <div class="meal-type">
              <label>
                <input type="checkbox" [(ngModel)]="employee.subscriptions.dinner">
                Dinner
              </label>
            </div>
          </div>
          
          <button class="btn-primary" (click)="saveSubscriptions(employee)">
            Update Subscriptions
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: var(--space-3);
    }
    
    .subscription-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-3);
    }
    
    .subscription-card {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-3);
      box-shadow: var(--shadow-sm);
    }
    
    .employee-info {
      text-align: center;
      margin-bottom: var(--space-3);
    }
    
    .employee-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-bottom: var(--space-2);
    }
    
    .meal-options {
      margin: var(--space-3) 0;
    }
    
    .meal-type {
      margin: var(--space-2) 0;
    }
    
    .meal-type label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
    }
    
    button {
      width: 100%;
    }
  `]
})
export class SubscriptionsComponent {
  employees: (Employee & { subscriptions: { breakfast: boolean; lunch: boolean; dinner: boolean } })[] = [];

  constructor(private employeeService: EmployeeService) {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees.map(emp => ({
        ...emp,
        subscriptions: {
          breakfast: false,
          lunch: false,
          dinner: false
        }
      }));
    });
  }

  saveSubscriptions(employee: Employee & { subscriptions: any }) {
    // TODO: Implement subscription saving logic
    console.log('Saving subscriptions for:', employee);
  }
}