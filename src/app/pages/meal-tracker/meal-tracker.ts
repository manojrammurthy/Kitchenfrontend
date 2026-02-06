import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee, MealType } from '../../models/employee.model';
import { LocationService, WorkLocation } from '../../services/location.service';
import { DailyMenuService } from '../../services/daily-menu.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-meal-consumption',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sign-in-container fade-in">
     
    <div *ngIf="errorMessage" class="error-popup">
        {{ errorMessage }}
        <button (click)="errorMessage = null">×</button>
      </div>

      <div class="row-controls">
        <div class="search-box">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="filterEmployees()"
            placeholder="Search employee by name"
            class="filter-emp"
          />
        </div>

        <div class="form-group location-select">
          <select
            class="form-control"
            id="workLocation"
            [(ngModel)]="selectedWorkLocationId"
            (change)="onLocationChange($event)"
            name="workLocation"
            required>
            <option value="all">All Locations</option>
            <option *ngFor="let location of workLocations" [value]="location.id">
              {{ location.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="sign-in-grid">
        <div class="sign-in-card" *ngFor="let employee of filteredEmployees" (click)="selectEmployee(employee)">
          <div class="employee-avatar">
            <img [src]="employee.profile_image || 'https://randomuser.me/api/portraits/lego/1.jpg'" alt="{{ employee.full_name }}">
          </div>
          <div class="employee-info">
            <h3>{{ employee.full_name }}</h3>
            <p>{{ employee.programme }}</p>
          </div>
        </div>
      </div>

      <!-- Modal Backdrop -->
        <div class="modal-backdrop" *ngIf="selectedEmployee">
          <!-- Modal Dialog -->
          <div class="meal-selection popup-dialog">
            <div class="meal-header">
              <h3>Hi, {{ selectedEmployee.full_name }}!</h3>
              <p>Please select your meal</p>
            </div>

            <!-- Meal options -->
            
            <div class="meal-options">
              <ng-container *ngFor="let meal of mealTypes">
                <div
                  class="meal-card"
                  *ngIf="hasMenuForMeal(meal)"
                  (click)="selectMeal(meal)"
                >
                  <div class="meal-icon">
                    {{ getMealIcon(meal) }}
                  </div>
                  <div class="meal-info">
                    <h4>{{ meal }}</h4>
                    <p>{{ getMealRate(meal) | currency:'INR':'symbol' }}</p>
                  </div>
                </div>
              </ng-container>
            </div>

            <div class="guest-section">
              <h4>Additional Guests</h4>

              <div
                *ngFor="let guest of additionalPeople; let i = index; trackBy: trackByIndex"
                class="guest-input-group"
              >
                <input
                  type="text"
                  [(ngModel)]="additionalPeople[i]"
                  placeholder="Guest name"
                  class="guest-input"
                />
                <button
                  *ngIf="additionalPeople.length > 0"
                  class="remove-btn"
                  (click)="removeGuestField(i)"
                  type="button"
                >
                  🗑️
                </button>
              </div>

              <button class="add-btn" (click)="addGuestField()" type="button">+ Add Guest</button>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="btn-secondary" (click)="cancelSelection()">Cancel</button>
              <button class="btn-primary" [disabled]="!selectedMeal" (click)="confirmMeal()">
                Confirm Meal
              </button>
            </div>
          </div>
        </div>

      <div class="confirmation-dialog" *ngIf="showConfirmation">
        <div class="confirmation-content slide-in-up">
          <div class="confirmation-icon">✅</div>
          <h3>Thank You!</h3>
          <p>Your {{ selectedMeal }} has been recorded.</p>
          <p class="confirmation-details">
            Employee: {{ selectedEmployee?.full_name }}<br>
            Date: {{ currentDate | date:'medium' }}<br>
            Rate: {{ finalRate | currency:'INR':'symbol' }}
          </p>
          <button class="btn-primary" (click)="closeConfirmation()">Done</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sign-in-container {
      padding: var(--space-3);
      max-width: 100%;
      margin: 0 auto;
    }

    .error-popup {
      background-color: #ffdddd;
      color: #b71c1c;
      border: 1px solid #f44336;
      padding: 10px 14px;
      margin-bottom: 10px;
      border-radius: 6px;
      font-weight: 500;
      position: relative;
    }

    .error-popup button {
      position: absolute;
      top: 5px;
      right: 8px;
      border: none;
      background: transparent;
      color: #b71c1c;
      font-size: 18px;
      cursor: pointer;
    }


    .row-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    .row-controls .location-select {
      width: 200px;
    }

    .search-box{
      margin-bottom: 1rem;
    }
    .filter-emp {
      width: 100%;
      max-width: 400px;
      padding: 10px 14px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
      box-sizing: border-box;
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
    

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* semi-transparent */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .popup-dialog {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      width: auto;
      min-width: 600px;
      max-width: 1000px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: fadeInUp 0.3s ease-out;
    }


    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
      display: flex;
      justify-content: center; /* horizontal centering */
      flex-wrap: wrap; /* wrap cards to next line if too many */
      gap: 1rem; /* spacing between cards */
      margin-top: 1.5rem;
    }

    .meal-card {
      flex: 1;
      max-width: 150px; 
      min-width: 150px;
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

    .guest-section {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }

    .guest-section h4 {
      margin-bottom: 10px;
      font-size: 16px;
      color: #333;
    }

    .guest-input-group {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .guest-input {
      flex: 1;
      padding: 8px 12px;
      max-width: 250px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
    }

    .remove-btn {
      margin-left: 8px;
      background-color: #ffdddd;
      color: #c00;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }

    .add-btn {
      margin-top: 10px;
      background-color: #e0f7fa;
      color: #00796b;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
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

export class MealTrackerComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  selectedMeal: MealType | null = null;
  finalRate: number = 0;
  mealRates: { [key in MealType]?: number } = {}; additionalPeople: string[] = [];
  showConfirmation = false;
  currentDate = new Date();
  searchTerm: string = '';
  workLocations: WorkLocation[] = [];
  selectedWorkLocationId: number | 'all' | null = null;
  mealTypes = Object.values(MealType);
  errorMessage: string | null = null;
  menu: any[] = [];
  userLocationId: number | null = null;

  constructor(public employeeService: EmployeeService,
    public locationService: LocationService,
    public dailyMenuService: DailyMenuService,
    public userService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    const currentUser = this.userService.getCurrentUser();

    if (currentUser?.location?.id) {
      this.userLocationId = currentUser.location.id;
    }

    await this.loadWorkLocations();
    await this.loadDailyMenu();

    this.employeeService.getMealConsumptions().subscribe(
      data => { },
      error => {
        console.error('Error fetching meal consumptions:', error);
      }
    );
  }

  loadEmployees(locationId: number | 'all'): void {
    if (locationId === 'all') {
      this.employeeService.getEmployees().subscribe(employees => {
        this.employees = employees;
        this.filteredEmployees = employees;
      });
    } else {
      this.employeeService.getEmployeesMT(locationId).subscribe(employees => {
        this.employees = employees;
        this.filteredEmployees = employees;
      });
    }
  }

  loadDailyMenu(): void {
    this.dailyMenuService.getDailyMenu().subscribe(menu => {
      this.menu = menu;
    });
  }

  loadWorkLocations(): void {
    this.locationService.getAllWorkLocations().subscribe({
      next: (locations: WorkLocation[]) => {
        this.workLocations = locations;

        const userLocationId = this.locationService.getUserLocationId();

        if (userLocationId && locations.some(loc => loc.id === userLocationId)) {
          this.selectedWorkLocationId = userLocationId;
        } else if (locations.length > 0) {
          this.selectedWorkLocationId = locations[0].id;
        } else {
          this.selectedWorkLocationId = null;
        }

        if (this.selectedWorkLocationId !== null) {
          this.loadEmployees(this.selectedWorkLocationId);
        } else {
          this.employees = [];
          this.filteredEmployees = [];
        }
      },
      error: (err) => {
        console.error('Failed to load work locations:', err);
      }
    });
  }

  onLocationChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'all') {
      this.selectedWorkLocationId = 'all';
      this.loadEmployees('all');
    } else {
      this.selectedWorkLocationId = +selectedValue;
      this.loadEmployees(this.selectedWorkLocationId);
    }
  }

  filterEmployees(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredEmployees = this.employees.filter(emp => {
      const fullName = emp.full_name?.toLowerCase() || '';
      return fullName.includes(term);
    });
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    this.selectedMeal = null;
    this.additionalPeople = [];
    this.finalRate = 0;
    this.employeeService.recordEmployeeSignIn(employee.id).subscribe();
  }

  addGuestField(): void {
    this.additionalPeople.push('');
  }

  removeGuestField(index: number): void {
    this.additionalPeople.splice(index, 1);
  }

  selectMeal(meal: MealType): void {
    this.selectedMeal = meal;
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
    this.additionalPeople = [];
    this.finalRate = 0;
  }

  async confirmMeal(): Promise<void> {
    if (this.selectedEmployee && this.selectedMeal) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];

      const cleanGuests = this.additionalPeople
        .map(name => name.trim())
        .filter(name => name.length > 0);

      // Get the meal entry from today's menu
      const todaysMenuEntry = this.menu.find(
        (entry) =>
          entry.date === formattedDate &&
          entry.meal_type.toLowerCase() === this.selectedMeal?.toLowerCase()
      );

      if (!todaysMenuEntry) {
        this.errorMessage = `No menu found for ${this.selectedMeal?.toLowerCase()} today.`;
        return;
      }

      // Multiply rate by total number of people
      const totalPeople = 1 + cleanGuests.length;
      this.finalRate = Math.round(todaysMenuEntry.rate * totalPeople * 100) / 100;

      const payload: any = {
        employee_id: this.selectedEmployee.id,
        consumption_location_id: this.userLocationId, // 👈 Replaced this.selectedWorkLocationId
        date: formattedDate,
        meal_type: this.selectedMeal.toLowerCase(),
        rate: this.finalRate.toFixed(2),
        notes: cleanGuests.length > 0 ? 'Guest included' : '',
        additional_people: cleanGuests
      };


      this.employeeService.addMealConsumption(payload).subscribe({
        next: () => {
          this.showConfirmation = true;
        },
        error: (err) => {
          if (
            err.status === 400 || err.status === 500 ||
            (typeof err.error === 'string' && (
              err.error.includes('already subscribed') ||
              err.error.includes('unique set')
            ))
          ) {
            const empName = this.selectedEmployee?.full_name || 'This employee';
            const meal = this.selectedMeal?.toLowerCase() || 'this meal';

            this.errorMessage = `${empName} has already subscribed for ${meal} today. Please choose a different meal.`;

            this.closeConfirmation();
          } else {
            this.errorMessage = 'An unexpected error occurred while recording the meal.';
          }
        }
      });
    }
  }

  getMealRate(meal: MealType): number {
    const today = new Date().toISOString().split('T')[0];
    const entry = this.menu.find(
      (m) => m.date === today && m.meal_type.toLowerCase() === meal.toLowerCase()
    );
    return entry ? entry.rate : 0;
  }

  hasMenuForMeal(meal: MealType): boolean {
    const today = new Date().toISOString().split('T')[0];
    return this.menu.some(
      (m) => m.date === today && m.meal_type.toLowerCase() === meal.toLowerCase()
    );
  }

  closeConfirmation(): void {
    this.showConfirmation = false;
    this.selectedEmployee = null;
    this.selectedMeal = null;
    this.additionalPeople = [];
    this.finalRate = 0;
  }

  getMealIcon(meal: MealType): string {
    switch (meal) {
      case MealType.BREAKFAST: return '🍳';
      case MealType.LUNCH: return '🍲';
      case MealType.DINNER: return '🍽️';
      default: return '🍴';
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
