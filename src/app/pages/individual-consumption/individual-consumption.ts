import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee, MealConsumption, MealType } from '../../models/employee.model';
import { MonthType } from '../../models/inventory-item.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DailyMenuService } from '../../services/daily-menu.service';

@Component({
  selector: 'app-individual-consumption',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
      <div class="container fade in">
        <h2>Individual Meal Consumption</h2>
        <div class="filter-card">
          <div class="filters-row">
            <div class="filter-item">
              <input
                id="employeeSearch"
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterEmployees()"
                (focus)="showDropdown = true"
                (blur)="blurDropdown()"
                placeholder="Search employee"
                class="form-control"
              />
              <ul class="dropdown-list" *ngIf="showDropdown && filteredEmployees.length">
                <li *ngFor="let emp of filteredEmployees" (click)="selectEmployee(emp)">
                  {{ emp.full_name }}
                </li>
              </ul>
            </div>

            <!-- Month Filter -->
            <div class="filter-item">
              <select class="form-control" [(ngModel)]="monthFilter">
                <option value="">Select the month</option>
                <option *ngFor="let month of months" [value]="month.value">{{ month.label }}</option>
              </select>
            </div>

            <!-- Year Filter -->
            <div class="filter-item">
              <select class="form-control" [(ngModel)]="yearFilter">
                <option value="">Select the year</option>
                <option *ngFor="let year of years" [value]="year">{{ year }}</option>
              </select>
            </div>

            <!-- Submit Button -->
            <div class="filter-item">
              <button class="btn btn-primary" (click)="applyFilters()">Submit</button>
            </div>
            <button class="btn btn-primary" (click)="exportToExcel()">Export to Excel</button>
          </div>
        </div>

        <!-- Scroll Target -->
        <div #dataSection>

          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-icon">🍳</div>
              <div class="stat-content">
                <h3>Total Meals</h3>
                <p class="stat-value">{{ getTotalMeals() }}</p>
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
                  <th>Actions</th>
                </tr>
              </thead>
            <tbody>
                <tr *ngFor="let meal of recentMeals">
                  <td>{{ meal.employee.full_name }}</td>
                  <td>{{ meal.meal_type }}</td>
                  <td>{{ meal.additional_people}}</td>
                  <td>{{ meal.date | date:'medium' }}</td>
                  <td>{{ meal.rate | currency:'INR':'symbol' }}</td>
                  <td class="actions-cell">
                    <div class="actions-wrapper">
                      <button class="btn-icon" (click)="startEditing(meal)">✏️</button>
                      <button class="btn-icon" (click)="deleteMeal(meal)">🗑️</button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="recentMeals.length === 0">
                  <td colspan="5" class="empty-message">No consumption records found</td>
                </tr>
              </tbody>
            </table>
          </div>
          
      <!-- Backdrop -->
        <div *ngIf="isEditMode" class="modal-backdrop" (click)="cancelEdit()"></div>

          <!-- Modal Dialog -->
          <div class="modal" *ngIf="isEditMode">
            <div class="modal-content">
              <div class="modal-header">
                <h3>Edit Meal Record</h3>
                <button class="close-button" (click)="cancelEdit()">×</button>
              </div>

              <div class="modal-body">
                <form [formGroup]="editForm" (ngSubmit)="submitEdit()">
                  <div class="form-row">
                    <label>Employee Name</label>
                    <input
                      type="text"
                      class="form-control"
                      [value]="selectedEmployee?.full_name"
                      readonly />
                  </div>
                  <div class="form-row">
                    <label>Date</label>
                    <input type="date" formControlName="date" class="form-control" />
                  </div>

                  <div class="form-row">
  <label>Meal Type</label>
  <select formControlName="meal" class="form-control">
    <option *ngFor="let type of mealTypes" [value]="type">{{ type | titlecase }}</option>
  </select>
</div>


                  <div class="form-row">
                    <label>Rate</label>
                    <input type="number" formControlName="rate" class="form-control" />
                  </div>

                  <div class="form-row" formArrayName="additional_people">
                    <label>Additional Guests</label>
                    <div *ngFor="let guestCtrl of additionalPeople.controls; let i = index" class="guest-input-group">
                      <input
                        type="text"
                        class="form-control mb-2"
                        [formControlName]="i"
                        placeholder="Guest name" />
                      <button type="button" class="btn btn-sm btn-primary ml-2" (click)="removeGuest(i)">Remove</button>
                    </div>
                    <button type="button" class="btn btn-sm btn-primary mt-2" (click)="addGuest()">+ Add Guest</button>
                  </div>

                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary" (click)="cancelEdit()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save</button>
                  </div>
                </form>
              </div>
            </div>
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
      </div>
    `,
  styles: [`
    .container {
      padding: var(--space-3);
      max-width: 100%;
      margin: 0 auto;
    }

    .filter-card {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-3);
      box-shadow: var(--shadow-sm);
    }

    .filters-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-3);
      align-items: end;
    }

    .filter-item {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      cursor: pointer;
      border: none;
      color: white;
      transition: background 0.3s ease;
    }

    .btn:hover {
      background: var(--primary-700);
    }

    .form-control {
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius-md);
      background-color: var(--neutral-50);
      transition: border 0.3s ease;
    }

    .form-control:focus {
      border-color: var(--primary-500);
      outline: none;
      background-color: #fff;
    }

    .dropdown-list {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: white;
      border: 1px solid var(--neutral-300);
      max-height: 200px;
      overflow-y: auto;
      z-index: 100;
      margin-top: 0.25rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
    }

    .dropdown-list li {
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .dropdown-list li:hover {
      background-color: var(--neutral-100);
    }

    @media (max-width: 768px) {
      .filters-row {
        grid-template-columns: 1fr;
      }

      .title-outside {
        text-align: center;
      }
    }

    .container {
      padding: var(--space-3);
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-3);
      margin-top: var(--space-3);
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

    .actions-cell {
      white-space: nowrap;
      padding: 0.5rem;
    }

    .actions-wrapper {
      display: flex;
      flex-wrap: nowrap;
      gap: 0.5rem;
    }

    .btn-icon {
      background: transparent;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.25rem;
    }
    
    .btn-icon:hover {
      background-color: var(--neutral-100);
    }

    .empty-message {
      text-align: center;
      padding: var(--space-3);
      color: var(--neutral-500);
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
      z-index: 1000;
    }

    .modal-content {
      position: relative;
      background-color: #fff;
      padding: 25px 20px;
      width: 90%;
      max-width: 600px;
      border-radius: 10px;
      animation: slideUp 0.3s ease-out;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-height: 90vh;
      overflow-y: auto;
      font-family: "Segoe UI", sans-serif;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 600;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #666;
      cursor: pointer;
    }

    .close-button:hover {
      color: #000;
    }

    .modal-body .form-row {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
    }

    .modal-body label {
      margin-bottom: 6px;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      padding: 8px 10px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      transition: border-color 0.2s ease;
    }

    .guest-input-group {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .guest-input-group .form-control {
      flex: 1;
    }

    .guest-input-group .btn {
      margin-left: 8px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 24px;
    }

    /* Keep original Bootstrap button colors and sizes — no overrides here */

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        transform: translateY(40px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
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

export class IndividualConsumptionComponent implements OnInit {
  @ViewChild('dataSection') dataSection!: ElementRef;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  selectedEmployee: Employee | null = null;
  showDropdown: boolean = false;

  months = Object.values(MonthType);
  monthFilter: string = '';
  yearFilter: string = '';
  years: string[] = [];
  mealTypes = Object.values(MealType);

  editForm!: FormGroup;
  isEditMode = false;
  editingMealId: number | null = null;
  recentMeals: any[] = [];
  menu: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private dailyMenuService: DailyMenuService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDailyMenu();
    this.generateYearOptions();
    this.initForm();
    const today = new Date();
    this.monthFilter = (today.getMonth() + 1).toString();
    this.yearFilter = today.getFullYear().toString();
  }

  generateYearOptions(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    this.years = Array.from({ length: 3 }, (_, i) => (startYear + i).toString());
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
      },
      error: (err) => console.error('Error loading employees:', err)
    });
  }

  loadDailyMenu(): void {
    this.dailyMenuService.getDailyMenu().subscribe(menu => {
      this.menu = menu;
    });
  }

  loadEmployeeConsumption(): void {
    if (this.selectedEmployee && this.monthFilter && this.yearFilter) {
      const month = parseInt(this.monthFilter);
      const year = parseInt(this.yearFilter);

      this.employeeService.getMonthlySummary(this.selectedEmployee.id, month, year).subscribe({
        next: (data) => {
          this.recentMeals = data;
        },
        error: (err) => {
          console.error('Error loading meals:', err);
        }
      });
    }
  }

  exportToExcel(): void {
    if (!this.recentMeals || this.recentMeals.length === 0) {
      console.warn('No data to export');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.recentMeals);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Meal Consumption': worksheet },
      SheetNames: ['Meal Consumption'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileName = `Meal_Consumption_${this.selectedEmployee!.full_name}_${this.monthFilter}_${this.yearFilter}.xlsx`;
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(data, fileName);
  }

  initForm(): void {
    this.editForm = this.fb.group({
      employee_name: [{ value: '', disabled: true }],
      employee: [null, Validators.required],
      date: [null, Validators.required],
      meal: [null, Validators.required],
      rate: [null, [Validators.required, Validators.min(0)]],
      consumption_location: [null, Validators.required],
      additional_people: this.fb.array([])
    });

    this.editForm.valueChanges.subscribe((value) => {
      if (value.date && value.meal) {
        const date = new Date(value.date);
        const mealType = value.meal as MealType;
        const guestCount = this.additionalPeople.length;

        const formattedDate = date.toISOString().split('T')[0];
        const entry = this.menu.find(
          (m) => m.date === formattedDate && m.meal_type.toLowerCase() === mealType.toLowerCase()
        );

        if (entry) {
          const totalPeople = 1 + guestCount;
          const calculatedRate = Math.round(entry.rate * totalPeople * 100) / 100;
          this.editForm.patchValue({ rate: calculatedRate }, { emitEvent: false });
        } else {
          this.editForm.patchValue({ rate: 0 }, { emitEvent: false });
        }
      }
    });
  }

  startEditing(meal: any): void {
    this.isEditMode = true;
    this.editingMealId = meal.id;

    this.editForm.reset();
    this.additionalPeople.clear();

    if (Array.isArray(meal.additional_people)) {
      meal.additional_people.forEach((guest: string) => this.addGuest(guest));
    } else if (typeof meal.additional_people === 'string') {
      const guests: string[] = meal.additional_people
        .split(',')
        .map((name: string): string => name.trim())
        .filter((name: string): boolean => name.length > 0);
      guests.forEach((guest: string) => this.addGuest(guest));
    }
    this.editForm.patchValue({
      employee: meal.employee?.id || null,
      date: this.getDateOnly(meal.date),
      meal: meal.meal_type || null,
      rate: parseFloat(meal.rate) || null,
      consumption_location: meal.consumption_location?.id || null
    });
    this.editForm.get('employee_name')?.setValue(meal.employee?.full_name || '');
  }

  private getDateOnly(dateStr: string): string | null {
    if (!dateStr) return null;
    return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  }

  submitEdit(): void {
    if (this.editForm.invalid || this.editingMealId === null) return;

    const guests = this.additionalPeople.controls.map(control => control.value);
    const formValue = this.editForm.value;
    const cleanedGuests = guests
      .map(g => g.trim())
      .filter(g => g.length > 0);

    const payload = {
      employee_id: formValue.employee,
      date: formValue.date,
      meal_type: formValue.meal,
      rate: formValue.rate,
      consumption_location_id: formValue.consumption_location,
      additional_people: cleanedGuests,
    };

    this.employeeService.editMealConsumption(this.editingMealId, payload).subscribe({
      next: (updatedMeal: any) => {
        const index = this.recentMeals.findIndex(m => m.id === this.editingMealId);
        if (index !== -1) this.recentMeals[index] = updatedMeal;

        this.cancelEdit();
      },
      error: (err) => {
        console.error('Failed to update meal:', err);
        alert('Failed to update meal record.');
      }
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editingMealId = null;
    this.editForm.reset();
    this.additionalPeople.clear();
  }

  get additionalPeople(): FormArray {
    return this.editForm.get('additional_people') as FormArray;
  }

  addGuest(name: string = ''): void {
    this.additionalPeople.push(this.fb.control(name, Validators.required));
  }

  removeGuest(index: number): void {
    this.additionalPeople.removeAt(index);
  }

  deleteMeal(meal: MealConsumption): void {
    const confirmed = confirm(`Are you sure you want to delete the meal record for ${meal.employee_name} on ${meal.date}?`);
    if (confirmed) {
      this.employeeService.deleteMealConsumption(meal).subscribe({
        next: () => {
          this.recentMeals = this.recentMeals.filter(m => m.id !== meal.id);
        },
        error: (err) => {
          console.error('Failed to delete meal:', err);
          alert('Failed to delete meal record.');
        }
      });
    }
  }

  getTotalCost(): number {
    return this.recentMeals.reduce((total, meal) => {
      const rate = typeof meal.rate === 'number' ? meal.rate : parseFloat(meal.rate as any) || 0;
      return total + rate;
    }, 0);
  }


  getTotalMeals(): number {
    return this.recentMeals.reduce((total, meal) => {
      const extra = Array.isArray(meal.additional_people) ? meal.additional_people.length : 0;
      return total + 1 + extra; // 1 for the employee + additional people
    }, 0);
  }


  getMealTypeCount(type: MealType): number {
    return this.recentMeals.reduce((total, meal) => {
      if (meal.meal_type?.toLowerCase() === type.toLowerCase()) {
        const extra = Array.isArray(meal.additional_people) ? meal.additional_people.length : 0;
        return total + 1 + extra; // 1 for the employee + additional people
      }
      return total;
    }, 0);
  }

  getMealTypeCost(type: MealType): number {
    return this.recentMeals
      .filter(meal => meal.meal_type?.toLowerCase() === type.toLowerCase())
      .reduce((total, meal) => {
        const rate = typeof meal.rate === 'number'
          ? meal.rate
          : parseFloat(meal.rate as any) || 0;
        return total + rate;
      }, 0);
  }

  filterEmployees(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.full_name.toLowerCase().includes(term)
    );
    this.showDropdown = true;
  }

  selectEmployee(emp: Employee): void {
    this.selectedEmployee = emp;
    this.searchTerm = emp.full_name;
    this.showDropdown = false;
  }

  blurDropdown(): void {
    setTimeout(() => this.showDropdown = false, 200);
  }

  applyFilters(): void {
    this.loadEmployeeConsumption();
  }
}