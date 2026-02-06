import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { DailyMenuService } from "../../services/daily-menu.service";
import { LocationService } from "../../services/location.service";
import { FoodItemService } from "../../services/food.service";
import { FormsModule } from '@angular/forms'; // ✅ Add this
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatTableModule],
  template: `
     <div class="daily-menu-container">
  <!-- Page Header -->
  <div class="page-header">
    <h2>Daily Menu</h2>
    <div class="button-group">
      <button class="btn-primary" (click)="openMenuForm()">Add daily menu</button>
      <button class="btn btn-secondary" (click)="showUploadModal = true">
        <span>📤</span> Upload
      </button>
    </div>
  </div>

  <!-- Upload Modal -->
  <div class="modal" *ngIf="showUploadModal" (click)="showUploadModal = false">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <h3 class="modal-title">Upload Food Menu (CSV/Excel)</h3>
        <button mat-icon-button (click)="showUploadModal = false">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="modal-body">
        <input
          type="file"
          (change)="onFileSelected($event)"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </div>
      <div class="modal-footer">
        <button mat-button (click)="showUploadModal = false">Cancel</button>
        <button mat-flat-button color="primary" (click)="uploadFile()" [disabled]="!selectedFile">
          Upload
        </button>
      </div>
    </div>
  </div>

  <!-- Toggle Buttons -->
  <div class="toggle-buttons">
    <button (click)="switchView('today')" [class.active]="currentView === 'today'">Today's Menu</button>
    <button (click)="switchView('upcoming')" [class.active]="currentView === 'upcoming'">Upcoming Menu</button>
  </div>

  <!-- Menu Grid -->
  <div class="menu-grid">
    <div class="menu-card" *ngFor="let menuItem of foodMenu">
      <div class="card-header">
        <div class="meal-info">
          <h3 class="meal-type">{{ menuItem.meal_type | titlecase }}</h3>
          <div class="rate-badge">₹{{ menuItem.rate }}</div>
          <p class="date">{{ menuItem.date | date: 'dd MMM yyyy' }}</p>
        </div>
        <div class="action-icons">
          <button class="icon-btn" (click)="editMenu(menuItem.id)">
            <mat-icon>edit</mat-icon>
          </button>
          <button class="icon-btn" (click)="deleteMenu(menuItem.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <div class="location-info">
        <div class="kitchen-location">
          <span class="label">Kitchen:</span>
          <span class="location-tag">{{ menuItem.kitchen_location.name }}</span>
        </div>
        <div class="serving-locations">
          <span class="label">Serving at:</span>
          <div class="location-tags">
            <span class="location-tag" *ngFor="let location of menuItem.serving_location">{{ location.name }}</span>
          </div>
        </div>
      </div>

      <div class="food-items-section">
        <h4>Food Items</h4>
        <div class="food-items-grid">
          <div class="food-item" *ngFor="let item of menuItem.food_items">
            <div class="food-name">{{ item.name }}</div>
            <div class="preparation-type">
              <span class="prep-badge" [class]="'prep-' + item.preparation_type">
                {{ item.preparation_type | titlecase }}
              </span>
            </div>
          </div>
        </div>
        <div class="button-container">
          <button class="btn-primary stock-btn" (click)="checkStockAvailability(menuItem.id)">
            Check Stock required
          </button>
        </div>
      </div>

      <div class="menu-details">
        <div class="serves-info">
          <span class="serves-icon">👥</span>
          <span>{{ menuItem.no_of_serves }} serves</span>
        </div>
        <div class="notes" *ngIf="menuItem.notes">
          <span class="notes-icon">📝</span>
          <span>{{ menuItem.notes }}</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Stock Availability Modal -->
<div class="modal-overlay" *ngIf="showAvailabilityModal" (click)="showAvailabilityModal = false">
  <div class="modal-container" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <h3>Stock Availability</h3>
      <button mat-icon-button (click)="showAvailabilityModal = false">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <div class="modal-body">
      <div *ngIf="availabilityResult?.summary?.length">
        <h3 class="section-title">Summary</h3>
        <table mat-table [dataSource]="availabilityResult.summary" class="mat-elevation-z2 full-width-table">
          <ng-container matColumnDef="ingredient">
            <th mat-header-cell *matHeaderCellDef> Ingredient </th>
            <td mat-cell *matCellDef="let element"> {{ element.ingredient }} </td>
          </ng-container>

          <ng-container matColumnDef="required">
            <th mat-header-cell *matHeaderCellDef> Required </th>
            <td mat-cell *matCellDef="let element"> {{ element.required }} </td>
          </ng-container>

          <ng-container matColumnDef="available">
            <th mat-header-cell *matHeaderCellDef> Available </th>
            <td mat-cell *matCellDef="let element"> {{ element.available }} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let element">
              <span [ngClass]="{ 'text-success': element.status === 'Sufficient', 'text-danger': element.status === 'Insufficient' }">
                {{ element.status }}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="['ingredient', 'required', 'available', 'status']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['ingredient', 'required', 'available', 'status'];"></tr>
        </table>
      </div>

      <ng-container *ngIf="availabilityResult?.item_wise_requirements as requirements">
        <h3 class="section-title">Item-wise Requirements</h3>
        <div *ngFor="let entry of getEntries(requirements)">
          <h4 class="food-item-header">{{ entry.key }}</h4>
          <table mat-table [dataSource]="entry.value" class="mat-elevation-z2 full-width-table">
            <ng-container matColumnDef="ingredient">
              <th mat-header-cell *matHeaderCellDef> Ingredient </th>
              <td mat-cell *matCellDef="let element"> {{ element.ingredient }} </td>
            </ng-container>
            <ng-container matColumnDef="required">
              <th mat-header-cell *matHeaderCellDef> Required </th>
              <td mat-cell *matCellDef="let element"> {{ element.required }} </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['ingredient', 'required']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['ingredient', 'required'];"></tr>
          </table>
        </div>
      </ng-container>
    </div>

    <div class="modal-footer">
      <button mat-flat-button color="primary" (click)="showAvailabilityModal = false">Close</button>
    </div>
  </div>
</div>

<!-- Add/Edit Menu Modal (MOVED OUTSIDE all other modals) -->
<div class="modal" *ngIf="showMenuForm" (click)="closeMenuForm()">
  <div class="modal-content slide-in-up" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <h3>Create Daily Menu</h3>
      <button class="btn-close" (click)="closeMenuForm()">×</button>
    </div>
    <div class="modal-body form-container">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Date</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="newMenu.date" name="date" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Meal Type</mat-label>
        <mat-select [(ngModel)]="newMenu.meal_type" name="meal_type">
          <mat-option *ngFor="let meal of mealChoices" [value]="meal.key">{{ meal.label }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Kitchen Location</mat-label>
        <mat-select [(ngModel)]="newMenu.kitchen_location_id" name="kitchen_location_id">
          <mat-option *ngFor="let loc of kitchenLocations" [value]="loc.id">{{ loc.name }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Serving Locations</mat-label>
        <mat-select multiple [(ngModel)]="newMenu.serving_location_ids" name="serving_location_ids">
          <mat-option *ngFor="let loc of servingLocations" [value]="loc.id">{{ loc.name }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>No. of Serves</mat-label>
        <input matInput type="number" [(ngModel)]="newMenu.no_of_serves" name="no_of_serves" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Food Items</mat-label>
        <mat-select multiple [(ngModel)]="newMenu.food_item_ids" name="food_item_ids">
          <mat-option *ngFor="let item of foodItems" [value]="item.id">{{ item.name }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Rate</mat-label>
        <input matInput type="number" [(ngModel)]="newMenu.rate" name="rate" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Notes</mat-label>
        <textarea matInput [(ngModel)]="newMenu.notes" name="notes"></textarea>
      </mat-form-field>
    </div>
    <div class="modal-footer">
      <button mat-button (click)="closeMenuForm()">Cancel</button>
      <button mat-flat-button color="primary" (click)="submitMenu()">Save Menu</button>
    </div>
  </div>
</div>

    `,
  styles: [`
    .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
}

.modal-header, .modal-footer {
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}

.modal-footer {
  border-top: 1px solid #ddd;
  border-bottom: none;
  justify-content: flex-end;
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  flex-grow: 1;
}

.food-item-header {
  margin: 16px 0 8px;
  font-weight: bold;
  font-size: 16px;
}

.full-width-table {
  width: 100%;
  font-size: 14px;
}


    .status-sufficient {
    color: green;
    font-weight: bold;
    }

    .status-insufficient {
    color: red;
    font-weight: bold;
    }

    .daily-menu-container {
        padding: var(--space-3);
        max-width: 100%;
        margin: 0 auto;
      }
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: var(--space-3);
    }

    .button-group {
        display: flex;
        gap: 10px; /* Adjust spacing between buttons */
    }

    .toggle-buttons {
        margin-bottom: 1rem;
        display: flex;
        gap: 10px;
    }

    .toggle-buttons button {
        padding: 6px 12px;
        border: 1px solid #ccc;
        background-color: white;
        cursor: pointer;
        border-radius: 4px;
    }

    .toggle-buttons button.active {
        background-color: var(--primary-600);
        color: white;
        border-color: var(--primary-600);
    }


    .menu-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .menu-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      margin-bottom: 20px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      max-width: 320px;
    }

    .menu-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;
    }

    .meal-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .rate-badge {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 1rem;
        box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
    }

    .action-icons {
        display: flex;
        gap: 8px;
    }

    .icon-btn {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 5px;
        cursor: pointer;
        transition: box-shadow 0.2s ease, background-color 0.2s ease;
        color: #333;
    }

    .icon-btn:hover {
        background-color: #f5f5f5;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .icon-btn mat-icon {
        font-size: 20px;
    }

    .date {
      margin: 4px 0 0 0;
      color: #6b7280;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .location-info {
      display: grid;
      gap: 12px;
      margin-bottom: 20px;
    }

    .kitchen-location, .serving-locations {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .label {
      font-weight: 600;
      color: #374151;
      min-width: 80px;
    }

    .value {
      color: #1f2937;
      font-weight: 500;
    }

    .location-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .location-tag {
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .food-items-section {
      margin-bottom: 20px;
    }

    .food-items-section h4 {
      margin: 0 0 12px 0;
      color: #1f2937;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .food-items-grid {
      display: grid;
      gap: 12px;
    }

    .food-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 4px solid #6366f1;
    }

    .food-name {
      font-weight: 500;
      color: #1f2937;
    }
    .button-container {
        display: flex;
        justify-content: center;
        margin: 16px 0;
    }

    .stock-btn {
        padding: 8px 16px;
        font-weight: bold;
    }


    .prep-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .prep-purchased {
      background: #fef3c7;
      color: #92400e;
    }

    .prep-prepared {
      background: #d1fae5;
      color: #065f46;
    }

    .menu-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .serves-info, .notes {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .serves-icon, .notes-icon {
      font-size: 1.1rem;
    }

    .notes {
      font-style: italic;
    }

    @media (max-width: 768px) {
      .menu-card {
        padding: 16px;
        margin-bottom: 16px;
      }

      .card-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .location-info {
        gap: 8px;
      }

      .kitchen-location, .serving-locations {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .menu-details {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .notes {
        max-width: 100%;
      }
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



/* === MODAL HEADER === */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 16px;
}

    .modal-body {
        margin-bottom: 24px;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 16px;
    }
      
    .full-width {
      width: 100%;
    }

    .availability-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.availability-table th,
.availability-table td {
  padding: 8px 12px;
  border: 1px solid #ccc;
  text-align: left;
}

.sufficient {
  color: green;
  font-weight: bold;
}

.insufficient {
  color: red;
  font-weight: bold;
}

.food-item-header {
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.2rem;
}


    `]
})

export class DailyMenuComponent {
  foodMenu: any[] = [];
  kitchenLocations: any[] = [];
  servingLocations: any[] = [];
  mealChoices: { key: string; label: string }[] = [];
  foodItems: any[] = [];

  newMenu: any = {};
  showMenuForm = false;
  editMode = false;
  editMenuId: number | null = null;

  showUploadModal = false;
  selectedFile: File | null = null;
  availabilityResult: any = null;
  selectedMenuIdForCheck: number | null = null;
  showAvailabilityModal = false;

  constructor(
    private dailyMenuService: DailyMenuService,
    private locationService: LocationService,
    private foodItemService: FoodItemService
  ) { }

  ngOnInit() {
    this.loadDailyMenu();
    this.loadInitialFormData();
  }

  currentView: 'today' | 'upcoming' = 'today';

  loadDailyMenu() {
    this.dailyMenuService.getDailyMenu().subscribe({
      next: (res) => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        this.foodMenu = res.filter((item: any) => {
          const itemDate = new Date(item.date).toISOString().split('T')[0];
          return itemDate === todayStr;
        });
      },
      error: (err) => console.error('Error loading today’s menu:', err)
    });
  }

  loadUpcomingMenu() {
    this.dailyMenuService.getDailyMenu().subscribe({
      next: (res) => {
        const today = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(today.getDate() + 7);

        this.foodMenu = res
          .filter((item: any) => {
            const itemDate = new Date(item.date);
            return itemDate > today && itemDate <= sevenDaysLater;
          })
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },
      error: (err) => console.error('Error loading upcoming menu:', err)
    });
  }

  switchView(view: 'today' | 'upcoming') {
    this.currentView = view;
    view === 'today' ? this.loadDailyMenu() : this.loadUpcomingMenu();
  }


  loadInitialFormData() {
    this.locationService.getKitchenLocations().subscribe({
      next: (res) => (this.kitchenLocations = res),
      error: (err) => console.error('Kitchen load error:', err)
    });

    this.locationService.getServingLocations().subscribe({
      next: (res) => (this.servingLocations = res),
      error: (err) => console.error('Serving location load error:', err)
    });

    this.foodItemService.getMealChoices().subscribe({
      next: (res) => (this.mealChoices = res),
      error: (err) => console.error('Meal choices error:', err)
    });

    this.foodItemService.getFoodItems().subscribe({
      next: (res) => (this.foodItems = res),
      error: (err) => console.error('Food items load error:', err)
    });
  }

  openMenuForm() {
    this.newMenu = {
      date: '',
      meal_type: '',
      kitchen_location_id: null,
      serving_location_ids: [],
      no_of_serves: null,
      food_item_ids: [],
      rate: '',
      notes: ''
    };
    this.showMenuForm = true;
  }

  editMenu(menuId: number) {
    const selected = this.foodMenu.find((m: any) => m.id === menuId);
    if (!selected) return;

    this.editMode = true;
    this.editMenuId = menuId;
    this.showMenuForm = true;

    this.newMenu = {
      date: selected.date,
      meal_type: selected.meal_type,
      kitchen_location_id: selected.kitchen_location?.id,
      serving_location_ids: (selected.serving_location || []).map((loc: any) => loc.id),
      no_of_serves: selected.no_of_serves,
      food_item_ids: (selected.food_items || []).map((item: any) => item.id),
      rate: selected.rate,
      notes: selected.notes
    };
  }

  closeMenuForm() {
    this.showMenuForm = false;
    this.editMode = false;
    this.editMenuId = null;
    this.newMenu = {};
  }

  submitMenu() {
    const formattedDate = this.formatLocalDate(this.newMenu.date);

    const payload = {
      ...this.newMenu,
      date: formattedDate
    };

    if (!payload.date || !payload.meal_type || !payload.kitchen_location_id ||
      payload.serving_location_ids.length === 0 || payload.food_item_ids.length === 0 ||
      !payload.no_of_serves || !payload.rate) {
      alert('Please fill all required fields');
      return;
    }

    if (this.editMode && this.editMenuId) {
      this.dailyMenuService.updateDailyMenu(this.editMenuId, payload).subscribe({
        next: (res) => {
          this.loadDailyMenu();
          this.closeMenuForm();
        },
        error: (err) => {
          console.error('Error updating menu:', err);
          alert('Failed to update daily menu');
        }
      });
    } else {
      this.dailyMenuService.addDailyMenu(payload).subscribe({
        next: (res) => {
          this.loadDailyMenu();
          this.closeMenuForm();
        },
        error: (err) => {
          console.error('Error adding menu:', err);
          alert('Failed to add daily menu');
        }
      });
    }
  }

  formatLocalDate(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  deleteMenu(id: number): void {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    this.dailyMenuService.deleteDailyMenu(id).subscribe({
      next: () => {
        this.loadDailyMenu(); // Refresh the list
      },
      error: (err) => {
        console.error('Error deleting menu:', err);
        alert('Failed to delete menu');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      alert('Please select a file first');
      return;
    }

    this.dailyMenuService.uploadDailyMenu(this.selectedFile).subscribe({
      next: (res) => {
        alert('Upload successful!');
        this.showUploadModal = false;
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert('Upload failed.');
      },
    });
  }

  checkStockAvailability(menuId: number): void {
    this.dailyMenuService.calculateAvailability(menuId).subscribe({
      next: (res) => {
        this.availabilityResult = res;
        this.showAvailabilityModal = true;
      },
      error: (err) => {
        console.error('Availability check failed', err);
        alert('Failed to calculate stock availability');
      }
    });
  }
  getEntries(obj: { [key: string]: any[] }) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }

}
