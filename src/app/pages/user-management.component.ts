import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { LocationService, WorkLocation } from '../services/location.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

const INVENTORY_API = environment.apiUrl;

const token = localStorage.getItem('accessToken');
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
};

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
   
<div class="user-management-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <div class="title-section">
            <h1 class="page-title">User Management</h1>
            <p class="page-subtitle">Manage users, roles, and permissions</p>
          </div>
          <button class="add-user-btn" (click)="openCreateUserDialog()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            Add User
          </button>
        </div>
        
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon stat-icon-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ users.length }}</div>
              <div class="stat-label">Total Users</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-icon-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getActiveUsersCount() }}</div>
              <div class="stat-label">Active Users</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-icon-warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getAdminCount() }}</div>
              <div class="stat-label">Administrators</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-section">
        <div class="table-header">
          <h2 class="table-title">All Users</h2>
          <div class="table-actions">
            <div class="search-box">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input type="text" class="search-input" [(ngModel)]="searchTerm" placeholder="Search users..." />
            </div>
          </div>
        </div>

        <div class="table-container" *ngIf="!loading && users.length > 0">
          <table class="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of filteredUsers(); trackBy: trackByUserId">
                <td class="user-cell">
                  <div class="user-info">
                    <div class="user-avatar">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                    <div class="user-details">
                      <div class="user-name">{{ user.username }}</div>
                      <div class="user-email">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="role-badge" [ngClass]="getRoleClass(user.role)">
                    {{ user.role }}
                  </span>
                </td>
                <td class="location-cell">{{ getLocationNameById(user.location) }}</td>
                <td>
                  <span class="status-badge" [ngClass]="'status-' + (user.is_active ? 'active' : 'inactive')">
                    <span class="status-dot"></span>
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button mat-icon-button class="action-btn edit-btn" (click)="openEditUserDialog(user)" title="Edit User">
                      <mat-icon>edit</mat-icon>
                    </button>

                    <button mat-icon-button class="action-btn reset-btn" (click)="resetPassword(user)" title="Reset Password">
                      <mat-icon>lock_reset</mat-icon>
                    </button>

                    <button mat-icon-button class="action-btn delete-btn" (click)="deleteUser(user)" title="Delete User">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading users...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && users.length === 0" class="empty-state">
          <div class="empty-illustration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 class="empty-title">No users found</h3>
          <p class="empty-description">Get started by adding your first user to the system</p>
          <button class="empty-action-btn" (click)="openCreateUserDialog()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add First User
          </button>
        </div>
      </div>
    </div>


  `,
  styles: [`
    .user-management-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Header Section */
.header-section {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

.add-user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.add-user-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.add-user-btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-icon-primary {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
}

.stat-icon-success {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
}

.stat-icon-warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  width: 18px;
  height: 18px;
  color: #64748b;
  z-index: 1;
}

.search-input {
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  color: #374151;
  width: 250px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  text-align: left;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.users-table tbody td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.table-row {
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row:last-child td {
  border-bottom: none;
}

/* User Cell */
.user-cell {
  min-width: 250px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #1a202c;
  font-size: 0.875rem;
  margin-bottom: 0.125rem;
}

.user-email {
  font-size: 0.75rem;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Role Badge */
.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.role-admin {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.role-admin-agent {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fed7aa;
}

.role-user {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-active {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.status-inactive {
  background: #f9fafb;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-active .status-dot {
  background: #16a34a;
}

.status-inactive .status-dot {
  background: #6b7280;
}

/* Location and Last Login */
.location-cell,
.last-login-cell {
  color: #64748b;
  font-size: 0.875rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: transparent;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.edit-btn {
  color: #3b82f6;
}

.edit-btn:hover {
  background: #eff6ff;
  color: #1d4ed8;
}

.reset-btn {
  color: #f59e0b;
}

.reset-btn:hover {
  background: #fffbeb;
  color: #d97706;
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f1f5f9;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-illustration {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #94a3b8;
}

.empty-illustration svg {
  width: 40px;
  height: 40px;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 2rem 0;
  max-width: 400px;
}

.empty-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.empty-action-btn svg {
  width: 16px;
  height: 16px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .user-management-container {
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.25rem;
  }
  
  .table-header {
    padding: 1.25rem 1.5rem;
  }
  
  .users-table thead th,
  .users-table tbody td {
    padding: 0.875rem 1rem;
  }
}

@media (max-width: 768px) {
  .user-management-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .user-cell {
    min-width: 200px;
  }
  
  .user-email {
    display: none;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
  }
  
  .action-btn svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 640px) {
  .users-table thead th:nth-child(3),
  .users-table tbody td:nth-child(3),
  .users-table thead th:nth-child(5),
  .users-table tbody td:nth-child(5) {
    display: none;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
}
  `]
})
export class UserManagementComponent implements OnInit {
  loading: boolean = false;
  workLocations: WorkLocation[] = [];
  users: any[] = [];
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private locationService = inject(LocationService);
  searchTerm: string = '';


  ngOnInit(): void {
    this.fetchUsers();
    this.fetchWorkLocations();
  }

  fetchWorkLocations() {
    this.locationService.getAllWorkLocations().subscribe({
      next: (locations) => {
        this.workLocations = locations;
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Failed to load locations', err);
      }
    });
  }

  fetchUsers() {
    this.loading = true;
    this.http.get<any[]>(INVENTORY_API + 'users/', httpOptions).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.loading = false;
      }
    });
  }


  openCreateUserDialog() {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '400px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchUsers();
    });
  }

  openEditUserDialog(user: any) {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '400px',
      data: { mode: 'edit', user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchUsers();
    });
  }

  resetPassword(user: any) {
    const newPassword = prompt(`Reset password for ${user.username}:`);
    if (newPassword) {
      this.http.post(INVENTORY_API + `users/${user.id}/reset_password/`, {
        password: newPassword
      }, httpOptions).subscribe(() => alert('Password reset!'));
    }
  }

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.http.delete(INVENTORY_API + `users/${user.id}/`, httpOptions).subscribe(() => {
        this.fetchUsers();
        alert('User deleted successfully!');
      });
    }
  }
  getLocationNameById(location: any): string {
    if (typeof location === 'object' && location?.name) {
      return location.name;
    }

    const match = this.workLocations.find(loc => loc.id === location);
    return match ? match.name : 'Unknown';
  }
  getActiveUsersCount(): number {
    return this.users.filter(user => user.is_active === true).length;
  }

  getAdminCount(): number {
    return this.users.filter(user => user.role?.toLowerCase() === 'admin').length;
  }
  trackByUserId(index: number, user: any): any {
    return user.id;
  }

  filteredUsers(): any[] {
    if (!this.searchTerm.trim()) {
      return this.users;
    }

    const term = this.searchTerm.trim().toLowerCase();

    return this.users.filter(user =>
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term) ||
      this.getLocationNameById(user.location).toLowerCase().includes(term)
    );
  }
  getRoleClass(role: string): string {
    return 'role-' + role.toLowerCase().replace(/\s+/g, '-');
  }

}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Edit User' : 'Create User' }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>First Name</mat-label>
        <input matInput formControlName="first_name" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Last Name</mat-label>
        <input matInput formControlName="last_name" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Role</mat-label>
        <mat-select formControlName="role">
          <mat-option *ngFor="let role of roleOptions" [value]="role.key">
            {{ role.label }}
          </mat-option>
        </mat-select>
      </mat-form-field>


      <mat-form-field appearance="outline" class="full-width" *ngIf="!isEditMode">
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Location</mat-label>
        <mat-select formControlName="location">
          <mat-option *ngFor="let loc of locationOptions" [value]="loc.id">
          {{ loc.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>


      <div mat-dialog-actions>
        <button mat-button type="submit" [disabled]="form.invalid">Save</button>
        <button mat-button mat-dialog-close>Cancel</button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
  `],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    NgIf,
    MatIconModule,
    MatTableModule,
  ]
})
export class UserFormDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  locationOptions: WorkLocation[] = [];

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  private locationService = inject(LocationService);
  private userService = inject(AuthService);
  roleOptions: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.isEditMode = data.mode === 'edit';

    this.form = this.fb.group({
      username: [data.user?.username || '', Validators.required],
      email: [data.user?.email || '', Validators.required],
      first_name: [data.user?.first_name || ''],
      last_name: [data.user?.last_name || ''],
      role: [data.user?.role || 'user', Validators.required],
      password: [''],
      location: [data.user?.location || '', Validators.required]
    });

    if (this.isEditMode) {
      this.form.get('password')?.clearValidators();
    } else {
      this.form.get('password')?.setValidators([Validators.required]);
    }
  }

  ngOnInit(): void {
    this.locationService.getAllWorkLocations().subscribe(locations => {
      this.locationOptions = locations;
    });

    this.userService.getRoleChoices().subscribe(roles => {
      this.roleOptions = roles;
      console.log(this.roleOptions);

    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const userData = {
      ...formValue,
      location: formValue.location // send the location ID
    };

    if (this.isEditMode) {
      this.http.put(INVENTORY_API + `users/${this.data.user.id}/`, userData).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.http.post(INVENTORY_API + 'users/', userData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
