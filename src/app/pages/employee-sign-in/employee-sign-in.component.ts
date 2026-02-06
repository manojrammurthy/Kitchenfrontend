import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee, MealType } from '../../models/employee.model';

@Component({
  selector: 'app-employee-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sign-in-container fade-in">
      <h2 class="page-title">Employee Sign-In</h2>
      
      <div class="sign-in-grid">
        <div class="sign-in-card" *ngFor="let employee of employees" (click)="selectEmployee(employee)">
          <div class="employee-avatar">
            <img [src]="employee.profile_image || 'https://randomuser.me/api/portraits/lego/1.jpg'" alt="{{ employee.full_name }}" />
          </div>
          <div class="employee-info">
            <h3>{{ employee.full_name }}</h3>
            <p>{{ employee.function }}</p>
          </div>
        </div>
      </div>
      
      <div class="meal-selection" *ngIf="selectedEmployee">
        <div class="meal-header">
          <h3>Hi, {{ selectedEmployee.full_name }}!</h3>
          <p>Please select your meal</p>
        </div>
        
        <div class="meal-options">
          <div class="meal-card" *ngFor="let meal of mealTypes" (click)="selectMeal(meal)">
            <div class="meal-icon">
              {{ getMealIcon(meal) }}
            </div>
            <div class="meal-info">
              <h4>{{ meal }}</h4>
              <p>{{ getMealRate(meal) | currency:'INR':'symbol' }}</p>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="btn-secondary" (click)="cancelSelection()">Cancel</button>
          <button class="btn-primary" [disabled]="!selectedMeal" (click)="confirmMeal()">
            Confirm Meal
          </button>
        </div>
      </div>
      
      <div class="confirmation-dialog" *ngIf="showConfirmation">
        <div class="confirmation-content slide-in-up">
          <div class="confirmation-icon">✅</div>
          <h3>Thank You!</h3>
          <p>Your {{ selectedMeal }} has been recorded.</p>
          <p class="confirmation-details">
            Employee: {{ selectedEmployee?.full_name }} <br>
            Date: {{ currentDate | date:'medium' }}<br>
            Rate: {{ getMealRate(selectedMeal) | currency:'INR':'symbol' }}
          </p>
          <button class="btn-primary" (click)="closeConfirmation()">Done</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sign-in-container {
      padding: var(--space-3);
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .page-title {
      margin-bottom: var(--space-4);
      color: var(--neutral-800);
      text-align: center;
    }
    
    .sign-in-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }
    
    .sign-in-card {
      background-color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .sign-in-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      background-color: var(--primary-50);
    }
    
    .employee-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: var(--space-2);
      border: 3px solid var(--primary-100);
    }
    
    .employee-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .employee-info {
      text-align: center;
    }
    
    .employee-info h3 {
      margin: 0 0 var(--space-1) 0;
      font-size: 1rem;
      font-weight: 500;
    }
    
    .employee-info p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--neutral-600);
    }
    
    .meal-selection {
      background-color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      padding: var(--space-4);
      margin-top: var(--space-4);
    }
    
    .meal-header {
      text-align: center;
      margin-bottom: var(--space-4);
    }
    
    .meal-header h3 {
      margin: 0 0 var(--space-1) 0;
      font-size: 1.5rem;
      color: var(--primary-700);
    }
    
    .meal-header p {
      margin: 0;
      color: var(--neutral-600);
    }
    
    .meal-options {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }
    
    .meal-card {
      background-color: var(--neutral-100);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }
    
    .meal-card:hover {
      background-color: var(--primary-50);
    }
    
    .meal-card.selected {
      background-color: var(--primary-50);
      border-color: var(--primary-500);
    }
    
    .meal-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--primary-100);
      border-radius: 50%;
      color: var(--primary-700);
    }
    
    .meal-info h4 {
      margin: 0 0 var(--space-1) 0;
      font-size: 1rem;
      font-weight: 500;
    }
    
    .meal-info p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--neutral-600);
    }
    
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: var(--space-3);
    }
    
    .confirmation-dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .confirmation-content {
      background-color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: var(--space-4);
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    
    .confirmation-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
      color: var(--success);
    }
    
    .confirmation-details {
      background-color: var(--neutral-100);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      margin: var(--space-3) 0;
      text-align: left;
    }
    
    @media (max-width: 576px) {
      .sign-in-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .meal-options {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class EmployeeSignInComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  selectedMeal: MealType | null = null;
  showConfirmation = false;
  currentDate = new Date();

  mealTypes = Object.values(MealType);

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees.filter(emp => emp.is_active);
    });
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    this.selectedMeal = null;

    this.employeeService.recordEmployeeSignIn(employee.id).subscribe();
  }

  selectMeal(meal: MealType): void {
    this.selectedMeal = meal;

    // Update selected meal card UI
    setTimeout(() => {
      const mealCards = document.querySelectorAll('.meal-card');
      mealCards.forEach(card => {
        card.classList.remove('selected');
        if (card.textContent?.includes(meal)) {
          card.classList.add('selected');
        }
      });
    });
  }

  cancelSelection(): void {
    this.selectedEmployee = null;
    this.selectedMeal = null;
  }

  confirmMeal(): void {
    if (this.selectedEmployee && this.selectedMeal) {
      this.employeeService.addMealConsumption({
        employee_id: this.selectedEmployee.id.toString(),
        date: new Date().toISOString(),
        meal: this.selectedMeal,
        rate: this.getMealRate(this.selectedMeal),
        employee: 0
      }).subscribe(() => {
        this.showConfirmation = true;
      });
    }
  }

  closeConfirmation(): void {
    this.showConfirmation = false;
    this.selectedEmployee = null;
    this.selectedMeal = null;
  }

  getMealIcon(meal: MealType): string {
    switch (meal) {
      case MealType.BREAKFAST:
        return '🍳';
      case MealType.LUNCH:
        return '🍲';
      case MealType.DINNER:
        return '🍽️';
      case MealType.SNACK:
        return '🍪';
      default:
        return '🍴';
    }
  }

  getMealRate(meal: MealType | null): number {
    if (!meal) return 0;

    const today = new Date();
    const day = today.getDay();

    // Check if today is Wednesday (3) or Friday (5)
    const isSpecialDay = day === 3 || day === 5;

    switch (meal) {
      case MealType.BREAKFAST:
        return isSpecialDay ? 6.00 : 5.00;
      case MealType.LUNCH:
        return isSpecialDay ? 10.00 : 8.50;
      case MealType.DINNER:
        return isSpecialDay ? 12.00 : 10.00;
      case MealType.SNACK:
        return isSpecialDay ? 4.00 : 3.50;
      default:
        return 0;
    }
  }
}