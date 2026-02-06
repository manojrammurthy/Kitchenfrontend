import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, PROGRAMME_DEPARTMENT_DATA, ProgrammeDepartments } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { LocationService, WorkLocation } from '../../services/location.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container fade-in">
      <div class="page-header">
        <h2>Employee Management</h2>
      </div>
      <input
        type="text"
        placeholder="Search by name"
        [(ngModel)]="searchTerm"
        (input)="filterEmployees()"
        class="filter-emp btn"
      />
      <div class="actions">
        <button class="btn-primary" (click)="openAddEmployeeForm()">Add Employee</button>
        <input
          type="file"
          #csvInput
          accept=".csv"
          style="display: none"
          (change)="uploadCSV($event)"
        />
        <button class="btn-secondary" (click)="csvInput.click()">Upload CSV</button>
      </div>
      <div class="employee-grid">
        <div class="employee-card" *ngFor="let employee of filteredEmployees">
          <div class="employee-header">
            <img [src]="employee.profile_image || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                 class="employee-avatar">
            <button class="delete-btn" (click)="deleteEmployee(employee.id)">🗑️</button>
          </div>
          <div class="employee-info">
            <h3>{{ employee.full_name }}</h3>
            <p class="employee-id">ID: {{ employee.employee_id }}</p>
            <p class="department">{{ employee.programme }}</p>
            <p class="role">{{ employee.function }}</p>
          </div>
          
          <div class="employee-actions">
            <button class="btn-icon" (click)="editEmployee(employee)">✏️</button>
            <button class="btn-icon" (click)="toggleEmployeeStatus(employee)">
              {{ employee.is_active ? '🔴' : '🟢' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Employee Modal -->
      <div class="modal" *ngIf="showEmployeeForm">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ isEditing ? 'Edit Employee' : 'Add New Employee' }}</h3>
            <button class="close-button" (click)="closeEmployeeForm()">×</button>
          </div>
          
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter the full name"
                  [(ngModel)]="currentEmployee.full_name">
              </div>
              <div class="form-group">
                <label>Employee ID</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter the employee id"
                  [(ngModel)]="currentEmployee.employee_id">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Programme</label>
                <select
                  class="form-control"
                  [(ngModel)]="currentEmployee.programme"
                  name="programme"
                  (change)="onProgrammeChangeEvent($event)"
                  [disabled]="isEditing">
                  <option value="" disabled hidden>Select a programme</option>
                  <option *ngFor="let programme of programmeOptions" [value]="programme">
                    {{ programme }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Function</label>
                <select
                  class="form-control"
                  [(ngModel)]="currentEmployee.function"
                  name="function"
                  [disabled]="!functionOptions.length || isEditing">
                  <option value="" disabled hidden>Select a function</option>
                  <option *ngFor="let func of functionOptions" [value]="func">
                    {{ func }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Email</label>
                <input
                  type="email"
                  class="form-control"
                  placeholder="Enter the email"
                  [(ngModel)]="currentEmployee.email">
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  class="form-control"
                  placeholder="Enter the phone no."
                  [(ngModel)]="currentEmployee.phone">
              </div>
              </div>
                <div class="form-group">
                  <label>Location</label>
                  <select
                    class="form-control"
                    [(ngModel)]="currentEmployee.work_location"
                    name="location"
                    [compareWith]="compareLocations"
                  >
                    <option value="" disabled hidden>Select a location</option>
                    <option *ngFor="let loc of employeeLocations" [ngValue]="loc">
                      {{ loc.name }}
                    </option>
                  </select>
                </div>
            <div class="form-row">
              <div class="form-group">
                <label>Joining Date</label>
                <input
                  type="date"
                  class="form-control"
                  [(ngModel)]="currentEmployee.joining_date">
              </div>
              <div class="form-group">
                <label>Profile Image URL</label>
                <input
                  type="url"
                  class="form-control"
                  placeholder="Enter image URL"
                  [(ngModel)]="currentEmployee.profile_image">
              </div>
            </div>          
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeEmployeeForm()">Cancel</button>
            <button class="btn-primary" (click)="saveEmployee()">
              {{ isEditing ? 'Update' : 'Add' }} Employee
            </button>
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

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
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
      padding: 20px;
      width: 90%;
      max-width: 600px;
      border-radius: 10px;
      animation: slideUp 0.3s ease-out;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      max-height: 90vh;
      overflow-y: auto;
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #555;
      cursor: pointer;
      z-index: 10;
    }

    .close-button:hover {
      color: #000;
    }

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
      margin-bottom: 16px;
    }
    .btn{
      margin-right: 16px;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
    }


    .employee-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-3);
    }

    .employee-card {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-3);
      box-shadow: var(--shadow-sm);
      position: relative;
      transition: all 0.3s ease;
    }

    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .employee-header {
      display: flex;
      align-items: center;
      margin-bottom: var(--space-3);
      position: relative;
    }

    .employee-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--primary-100);
    }

    .employee-status {
      position: absolute;
      right: 0;
      top: 0;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--neutral-400);
    }

    .employee-status.active {
      background: var(--success);
    }

    .employee-info {
      margin-bottom: var(--space-3);
    }

    .employee-info h3 {
      margin: 0 0 var(--space-1) 0;
      font-size: 1.25rem;
    }

    .employee-id {
      color: var(--neutral-600);
      font-size: 0.875rem;
      margin: 0 0 var(--space-1) 0;
    }

    .department {
      color: var(--primary-700);
      font-weight: 500;
      margin: 0 0 var(--space-1) 0;
    }

    .role {
      color: var(--neutral-600);
      margin: 0;
    }

    .employee-actions {
      display: flex;
      gap: var(--space-2);
      justify-content: flex-end;
    }

    .btn-icon {
      background: none;
      border: none;
      font-size: 1.25rem;
      padding: var(--space-1);
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: background-color 0.2s ease;
    }

    .btn-icon:hover,
    .delete-btn:hover {
      background-color: var(--neutral-100);
    }

    .delete-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      background: transparent;
      border: none;
      color: red;
      font-size: 18px;
      cursor: pointer;
      margin-left: auto;
    }


    @media (max-width: 768px) {
      .employee-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})

export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  employeeLocations: WorkLocation[] = [];
  showEmployeeForm = false;
  isEditing = false;
  searchTerm: string = '';
  filteredEmployees: Employee[] = [];
  currentEmployee: Partial<Employee> = {
    id: 0,
    employee_id: '',
    full_name: '',
    email: '',
    programme: '',
    function: '',
    phone: '',
    joining_date: new Date(),
    work_location: {
      id: 0,
      name: ''
    },
    is_active: true,
    profile_image: '',
    last_sign_in: undefined
  };

  programmeDepartmentData: ProgrammeDepartments[] = PROGRAMME_DEPARTMENT_DATA;
  programmeOptions: string[] = this.programmeDepartmentData.map(p => p.programme);
  functionOptions: string[] = [];
  constructor(private employeeService: EmployeeService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadLocation(): void {
    this.locationService.getAllWorkLocations().subscribe(locations => {
      this.employeeLocations = locations;
    });
  }
  compareLocations(loc1: WorkLocation, loc2: WorkLocation): boolean {
    return loc1 && loc2 ? loc1.id === loc2.id : loc1 === loc2;
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.filteredEmployees = employees;
    });
  }

  filterEmployees(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.full_name.toLowerCase().includes(term)
    );
  }

  openAddEmployeeForm(): void {
    this.isEditing = false;
    this.currentEmployee = {
      employee_id: '',
      full_name: '',
      email: '',
      programme: '',
      function: '',
      phone: '',
      joining_date: new Date(),
      work_location: { id: 0, name: '' },
      is_active: true,
      profile_image: '',
      last_sign_in: undefined
    };
    this.loadLocation();
    this.showEmployeeForm = true;
  }

  editEmployee(employee: Employee): void {
    this.isEditing = true;
    this.currentEmployee = { ...employee };
    this.loadLocation();
    this.onProgrammeChange(this.currentEmployee.programme || '');
    this.showEmployeeForm = true;
  }

  closeEmployeeForm(): void {
    this.showEmployeeForm = false;
    this.currentEmployee = {};
  }

  saveEmployee(): void {
    if (!this.currentEmployee.work_location) {
      alert('Please select a work location');
      return;
    }

    const payload: any = {
      ...this.currentEmployee,
      work_location_id: this.currentEmployee.work_location.id
    };

    if (!this.isEditing) {
      delete payload.id;
    }

    const request$ = this.isEditing
      ? this.employeeService.updateEmployee(payload)
      : this.employeeService.addEmployee(payload);

    request$.subscribe(() => {
      this.loadEmployees();
      this.closeEmployeeForm();
    });
  }

  onProgrammeChangeEvent(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.onProgrammeChange(selectedValue);
  }


  onProgrammeChange(selectedProgramme: string): void {
    const entry = this.programmeDepartmentData.find(p => p.programme === selectedProgramme);
    this.functionOptions = entry ? entry.departments : [];
    if (!this.isEditing) {
      this.currentEmployee.function = '';
    }
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();  // refresh the list
      });
    }
  }

  uploadCSV(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const formData = new FormData();
      formData.append('file', file);

      this.employeeService.uploadCSV(formData).subscribe({
        next: (res) => {
          alert(`${res.successfully_created} employees added.`);
          if (res.failed_entries?.length) {
            console.warn('Some entries failed:', res.failed_entries);
          }
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Upload failed:', err);
          alert('Failed to upload CSV.');
        }
      });
    }
  }

  toggleEmployeeStatus(employee: Employee): void {
    const updatedEmployee = {
      ...employee,
      isActive: !employee.is_active
    };

    this.employeeService.updateEmployee(updatedEmployee).subscribe(() => {
      this.loadEmployees();
    });
  }
}