import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { EmployeeService } from '../../services/employee.service';
import { WastageService } from '../../services/wastage.service';
import { InventoryItem } from '../../models/inventory-item.model';
import { MealConsumption } from '../../models/employee.model';
import { Wastage } from '../../models/wastage.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

  <div class="toolbar-right date-controls-modern">
  <div class="date-section">
    <i class="fas fa-calendar-alt"></i>
    <span>{{ fromDate | date: 'mediumDate' }} - {{ toDate | date: 'mediumDate' }}</span>
    <span class="day-count">({{ getDayCount() }} days)</span>
  </div>

  <div class="quick-filters">
    <button class="btn-modern" (click)="filterLastWeek()">
      <i class="fas fa-calendar-week"></i> Last Week
    </button>
    <button class="btn-modern" (click)="filterLastYear()">
      <i class="fas fa-calendar"></i> Last Year
    </button>
    <button class="btn-modern" (click)="filterLast2Years()">
      <i class="fas fa-history"></i> Last 2 Years
    </button>
  </div>

  <div class="custom-range">
    <label>
      <!-- <i class="fas fa-arrow-left"></i> -->
       From
      <input type="date">
    </label>
    <label>
      <!-- <i class="fas fa-arrow-right"></i> -->
       To
      <input type="date" >
    </label>
    <button class="btn-primary-modern" (click)="applyCustomRange()">
      <i class="fas fa-check"></i> Apply
    </button>
  </div>
</div>
    <div class="dashboard fade-in">
      <h2 class="page-title">Dashboard</h2>

      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">🥘</div>
          <div class="stat-content">
            <h3 class="stat-title">Total Inventory Items</h3>
            <p class="stat-value">{{ inventoryItems.length }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon warning">⚠️</div>
          <div class="stat-content">
            <h3 class="stat-title">Low Stock Items</h3>
            <p class="stat-value">{{ lowStockItems.length }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3 class="stat-title">Today's Meals</h3>
            <p class="stat-value">{{ todayMeals.length }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon error">🗑️</div>
          <div class="stat-content">
            <h3 class="stat-title">Wastage This Week</h3>
            <p class="stat-value">{{ wastageThisWeek.length }} items</p>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="card-header">
            <h3>Low Stock Items</h3>
            <a routerLink="/inventory" class="view-all">View All</a>
          </div>
          <div class="card-content">
            <table class="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Current Stock</th>
                  <th>Min. Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of lowStockItems.slice(0, 5)">
                  <td>{{ item.name }}</td>
                  <td>
                    <span class="stock-level" [class.critical]="item.current_stock <= item.minimum_stock / 2">
                      {{ item.current_stock }} {{ item.unit }}
                    </span>
                  </td>
                  <td>{{ item.minimum_stock }} {{ item.unit }}</td>
                </tr>
                <tr *ngIf="lowStockItems.length === 0">
                  <td colspan="3" class="empty-message">No low stock items</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-header">
            <h3>Recent Meals</h3>
            <a routerLink="/consumption" class="view-all">View All</a>
          </div>
          <div class="card-content">
            <table class="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Meal</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let meal of recentMeals">
                  <td>{{ meal.employee.full_name}}</td>
                  <td>{{ meal.meal_type }}</td>
                  <td>{{ meal.date | date:'short' }}</td>
                </tr>
                <tr *ngIf="recentMeals.length === 0">
                  <td colspan="3" class="empty-message">No recent meals</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-header">
            <h3>Recent Wastage</h3>
            <a routerLink="/wastage" class="view-all">View All</a>
          </div>
          <div class="card-content">
            <table class="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let wastage of recentWastage">
                  <td>{{ wastage.food_item.name }}</td>
                  <td>{{ wastage.quantity }} {{ wastage.unit }}</td>
                  <td>{{ wastage.reason }}</td>
                </tr>
                <tr *ngIf="recentWastage.length === 0">
                  <td colspan="3" class="empty-message">No recent wastage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-header">
            <h3>Expiring Soon</h3>
            <a routerLink="/inventory" class="view-all">View All</a>
          </div>
          <div class="card-content">
            <table class="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of expiringItems">
                  <td>{{ item.name.name }}</td>
                  <td>{{ item.expiry_date | date:'mediumDate' }}</td>
                  <td>
                    <span class="days-left" [class.critical]="getDaysLeft(item.expiry_date) <= 3">
                      {{ getDaysLeft(item.expiry_date) }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="expiringItems.length === 0">
                  <td colspan="3" class="empty-message">No items expiring soon</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-container">
          <a routerLink="/employee-sign-in" class="action-button">
            <span class="action-icon">👤</span>
            <span>Employee Sign-In</span>
          </a>
          <a routerLink="/inventory" class="action-button">
            <span class="action-icon">➕</span>
            <span>Add Inventory</span>
          </a>
          <a routerLink="/wastage" class="action-button">
            <span class="action-icon">🗑️</span>
            <span>Record Wastage</span>
          </a>
          <a routerLink="/reports" class="action-button">
            <span class="action-icon">📊</span>
            <span>View Reports</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: var(--space-3);
    }
    
    .page-title {
      margin-bottom: var(--space-4);
      color: var(--neutral-800);
    }
    
    .stats-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }
    
    .stat-card {
      background-color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      padding: var(--space-3);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .stat-icon {
      font-size: 2rem;
      background-color: var(--primary-50);
      color: var(--primary-700);
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
    }
    
    .stat-icon.warning {
      background-color: #FFF8E1;
      color: #F57F17;
    }
    
    .stat-icon.error {
      background-color: #FFEBEE;
      color: #C62828;
    }
    
    .stat-content {
      flex: 1;
    }
    
    .stat-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--neutral-600);
      margin: 0 0 var(--space-1) 0;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--neutral-800);
      margin: 0;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }
    
    .dashboard-card {
      background-color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.3s ease;
    }
    
    .dashboard-card:hover {
      box-shadow: var(--shadow-md);
    }
    
    .card-header {
      padding: var(--space-3);
      border-bottom: 1px solid var(--neutral-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .card-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 500;
    }
    
    .view-all {
      font-size: 0.875rem;
      color: var(--primary-600);
    }
    
    .card-content {
      padding: var(--space-3);
      max-height: 300px;
      overflow-y: auto;
    }
    
    .stock-level, .days-left {
      font-weight: 500;
    }
    
    .stock-level.critical, .days-left.critical {
      color: var(--error);
    }
    
    .empty-message {
      text-align: center;
      color: var(--neutral-500);
      padding: var(--space-3);
    }
    
    .quick-actions {
      background-color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      padding: var(--space-3);
      margin-bottom: var(--space-3);
    }
    
    .quick-actions h3 {
      margin-bottom: var(--space-3);
    }
    
    .actions-container {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }
    
    .action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3);
      background-color: var(--neutral-100);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: var(--neutral-800);
      transition: all 0.2s ease;
      min-width: 100px;
    }
    
    .action-button:hover {
      background-color: var(--primary-50);
      color: var(--primary-700);
      transform: translateY(-2px);
      text-decoration: none;
    }
    
    .action-icon {
      font-size: 1.5rem;
    }

    .date-controls-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background-color: #ffffff;
  padding: 16px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  gap: 15px;
  font-family: 'Segoe UI', sans-serif;
}

.date-section {
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.day-count {
  font-size: 14px;
  color: #777;
}

.quick-filters, .custom-range {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
    
    @media (max-width: 992px) {
      .stats-container {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 576px) {
      .stats-container {
        grid-template-columns: 1fr;
      }
      
      .actions-container {
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  lowStockItems: any[] = [];
  expiringItems: any[] = [];
  recentMeals: any[] = [];
  todayMeals: MealConsumption[] = [];
  recentWastage: any[] = [];
  wastageThisWeek: Wastage[] = [];
  fromDate!: Date;
  toDate!: Date;
  customFromDate!: string;
  customToDate!: string;

  constructor(
    private inventoryService: InventoryService,
    private employeeService: EmployeeService,
    private wastageService: WastageService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Default date range
    if (!this.fromDate || !this.toDate) {
      const today = new Date();
      this.fromDate = new Date(today.setHours(0, 0, 0, 0));
      this.toDate = new Date();
    }

    // Load low stock items
    this.inventoryService.getLowItems().subscribe({
      next: (items) => {
        this.lowStockItems = items;
      },
      error: (err) => {
        console.error('Error fetching low stock items', err);
        this.lowStockItems = [];
      }
    });

    // Load expiring soon items
    this.inventoryService.getExpiringSoonItems().subscribe({
      next: (items) => {
        this.expiringItems = items;
      },
      error: (err) => {
        console.error('Error fetching expiring items', err);
        this.expiringItems = [];
      }
    });

    // Load employee meals
    this.employeeService.getMealConsumptions().subscribe(meals => {
      const filteredMeals = this.fromDate && this.toDate
        ? meals.filter(meal => this.isInRange(meal.date))
        : meals;

      this.recentMeals = filteredMeals
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.todayMeals = filteredMeals.filter(meal => {
        const mealDate = new Date(meal.date);
        mealDate.setHours(0, 0, 0, 0);
        return mealDate.getTime() === today.getTime();
      });
    });

    // Load wastage data
    this.wastageService.getWastageItems().subscribe(wastage => {
      const filteredWastage = this.fromDate && this.toDate
        ? wastage.filter(item => this.isInRange(item.wastage_date))
        : wastage;

      this.recentWastage = filteredWastage
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);

      this.wastageThisWeek = filteredWastage.filter(item => {
        const wastageDate = new Date(item.date);
        return wastageDate >= weekAgo && wastageDate <= today;
      });
    });
  }

  isInRange(dateInput: string | Date): boolean {
    if (!this.fromDate || !this.toDate) return true;

    const date = new Date(dateInput);
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    // Normalize time to 00:00:00 for all dates
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999); // end of the toDate
    date.setHours(0, 0, 0, 0);

    return date >= from && date <= to;
  }

  getExpiringItems(items: InventoryItem[]): InventoryItem[] {
    const today = new Date();
    return items
      .filter(item => item.expiry_date && this.getDaysLeft(item.expiry_date) <= 7)
      .sort((a, b) => {
        const daysLeftA = this.getDaysLeft(a.expiry_date!);
        const daysLeftB = this.getDaysLeft(b.expiry_date!);
        return daysLeftA - daysLeftB;
      })
      .slice(0, 5);
  }

  getDaysLeft(expiryDate?: Date): number {
    if (!expiryDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  filterLastWeek() {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 7);

    this.fromDate = from;
    this.toDate = to;

    this.loadDashboardData();
  }

  filterLastYear() {
    const to = new Date();
    const from = new Date();
    from.setFullYear(to.getFullYear() - 1);

    this.fromDate = from;
    this.toDate = to;

    this.loadDashboardData();
  }

  filterLast2Years() {
    const to = new Date();
    const from = new Date();
    from.setFullYear(to.getFullYear() - 2);

    this.fromDate = from;
    this.toDate = to;

    this.loadDashboardData();
  }

  getDayCount(): number {
    if (!this.fromDate || !this.toDate) return 0;

    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    // Round to whole days (ignore time)
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  }

  applyCustomRange() {
    if (!this.customFromDate || !this.customToDate) {
      alert("Please select both start and end dates!");
      return;
    }

    const from = new Date(this.customFromDate);
    const to = new Date(this.customToDate);

    if (from > to) {
      alert("Start date cannot be after end date.");
      return;
    }

    this.fromDate = from;
    this.toDate = to;

    this.loadDashboardData();
  }

}