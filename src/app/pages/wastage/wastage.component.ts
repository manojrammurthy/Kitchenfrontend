import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WastageService } from '../../services/wastage.service';
import { LocationService } from '../../services/location.service';
import { DailyMenuService } from '../../services/daily-menu.service';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-wastage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatIconModule],
  template: `
    <div class="container fade-in">
      <div class="page-header">
        <h2>Kitchen Wastage Management</h2>
        <button class="btn-primary" (click)="openAddWastageForm()">Record Wastage</button>
      </div>

      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Total Items</h3>
            <p class="stat-value">{{ kitchenWastage.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon error">💰</div>
          <div class="stat-content">
            <h3>Total Cost</h3>
            <!-- <p class="stat-value">{{ getTotalCost() | currency:'INR':'symbol' }}</p> -->
          </div>
        </div>
      </div>

      <div class="wastage-grid">
        <div class="wastage-table">
          <h3>Recent Wastage</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Kitchen Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of kitchenWastage">
                <td>{{ item.food_item.name }}</td>
                <td>{{ item.quantity }} {{ item.unit }}</td>
                <td>
                  <span class="badge" [class]="'badge-' + getReasonClass(item.reason)">
                    {{ item.reason }}
                  </span>
                </td>
                <td>{{ item.wastage_date | date:'mediumDate' }}</td>
                <td>{{ item.kitchen_location.name }}</td>
                <td>
                  <button class="btn-icon" (click)="editWastage(item)">✏️</button>
                  <!-- <button class="btn-icon" (click)="deleteInventoryWastage(item.id)">🗑️</button> -->
                </td>
              </tr>
              <tr *ngIf="kitchenWastage.length === 0">
                <td colspan="6" class="empty-message">No wastage records found</td>
              </tr>
            </tbody>
          </table>
        </div>

      <div class="reason-distribution">
        <h3>Wastage by Reason</h3>
        <div class="reason-grid">
          <div 
            class="reason-card" 
            *ngFor="let stat of wastageByReason"
            [class]="'reason-' + getReasonClass(stat.reason)"
          >
            <h4>{{ stat.reason }}</h4>
            <h4>{{ getDisplayReason(stat.reason) }}</h4>
            <p class="count">{{ stat.count }}</p>
          </div>
        </div>
      </div>

      <div class="modal-overlay" *ngIf="showWastageModal" (click)="closeModal()">
          <div class="modal-container" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Record Kitchen Wastage</h3>
              <button mat-icon-button (click)="closeModal()">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <form [formGroup]="wastageForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Kitchen Location</mat-label>
                <mat-select formControlName="kitchen_location_id">
                  <mat-option *ngFor="let location of kitchenLocations" [value]="location.id">
                    {{ location.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="wastage_date" />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width" *ngIf="mealTypes.length">
                <mat-label>Meal Type</mat-label>
                <mat-select formControlName="meal_type">
                  <mat-option *ngFor="let meal of mealTypes" [value]="meal">
                    {{ meal }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width" *ngIf="foodItems.length">
                <mat-label>Food Item</mat-label>
                <mat-select formControlName="food_item_id">
                  <mat-option *ngFor="let item of foodItems" [value]="item.id">
                    {{ item.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <div class="row">
                <mat-form-field class="half-width" appearance="outline">
                  <mat-label>Quantity</mat-label>
                  <input matInput type="number" formControlName="quantity" />
                </mat-form-field>

                <mat-form-field class="half-width" appearance="outline">
                  <mat-label>Unit</mat-label>
                  <mat-select formControlName="unit">
                    <mat-option value="kg">kg</mat-option>
                    <mat-option value="g">g</mat-option>
                    <mat-option value="litre">litre</mat-option>
                    <mat-option value="ml">ml</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Reason</mat-label>
                <mat-select formControlName="reason">
                  <mat-option *ngFor="let reason of wastage_reason" [value]="reason.key">
                    {{ reason.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Notes</mat-label>
                <textarea matInput formControlName="notes" rows="2"></textarea>
              </mat-form-field>

              <div class="modal-footer">
                <button mat-button type="button" (click)="closeModal()">Cancel</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="!wastageForm.valid">
                  {{ editMode ? 'Update' : 'Submit' }}
                </button>
              </div>
            </form>
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

    .stat-icon.error {
      background: var(--error);
      color: white;
    }

    .wastage-grid {
      display: grid;
      gap: var(--space-4);
    }

    .wastage-table {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-3);
      box-shadow: var(--shadow-sm);
    }

    .reason-distribution {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-3);
      box-shadow: var(--shadow-sm);
    }

    .reason-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-3);
      margin-top: var(--space-3);
    }

    .reason-card {
      border-radius: var(--radius-md);
      padding: var(--space-3);
      text-align: center;
    }

    .reason-expired { background: #FFEBEE; }
    .reason-spoilage { background: #FCE4EC; }
    .reason-preparation_error { background: #F3E5F5; }
    .reason-leftovers { background: #E8EAF6; }
    .reason-overproduction { background: #E3F2FD; }
    .reason-preparation { background: #E0F7FA; }
    .reason-other { background: #F5F5F5; }

    .reason-card h4 {
      margin: 0 0 var(--space-2) 0;
      color: var(--neutral-700);
    }

    .count {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 var(--space-1) 0;
      color: var(--neutral-900);
    }

    .badge {
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
    }

    .badge-expired { background: #FFEBEE; color: #C62828; }
    .badge-spoilage { background: #FCE4EC; color: #AD1457; }
    .badge-preparation_error { background: #F3E5F5; color: #6A1B9A; }
    .badge-leftovers { background: #E8EAF6; color: #283593; }
    .badge-damaged { background: #E3F2FD; color: #1565C0; }
    .badge-overproduction { background: #E0F7FA; color: #00838F; }
    .badge-other { background: #F5F5F5; color: #424242; }


    .modal-overlay {
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
    .modal-container {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .half-width {
      width: 48%;
    }
    .row {
      display: flex;
      gap: 4%;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }

  `]
})

export class WastageComponent implements OnInit {

  wastageForm!: FormGroup;
  wastage_reason: any[] = [];
  wastageByReason: { reason: string, count: number }[] = [];

  kitchenLocations: any[] = [];
  dailyMenus: any[] = [];
  mealTypes: string[] = [];
  foodItems: any[] = [];
  availableMealTypes: string[] = [];
  showWastageModal = false;
  menusLoaded = false;
  kitchenWastage: any[] = [];
  editMode = false;
  editWastageId: number | null = null;


  constructor(
    private fb: FormBuilder,
    private wastageService: WastageService,
    private locationService: LocationService,
    private dailyMenuService: DailyMenuService
  ) { }

  ngOnInit(): void {
    this.loadKitchenWastage();
    this.initForm();
    this.loadKitchenLocations();
    this.loadDailyMenus();
    this.loadWastageReason();

    this.wastageForm.get('kitchen_location_id')?.valueChanges.subscribe(() => {
      this.filterMeals();
    });

    this.wastageForm.get('wastage_date')?.valueChanges.subscribe(() => {
      this.filterMeals();
    });

    this.wastageForm.get('meal_type')?.valueChanges.subscribe(() => {
      this.filterFoodItems();
    });
  }

  loadKitchenWastage() {
    this.wastageService.getKitchenWastage().subscribe((data) => {
      this.kitchenWastage = data;
      this.calculateWastageByReason(); // ✅ group counts
    });
  }


  initForm() {
    this.wastageForm = this.fb.group({
      kitchen_location_id: [null, Validators.required],
      wastage_date: [null, Validators.required],
      meal_type: [null, Validators.required],
      food_item_id: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      unit: [null, Validators.required],
      reason: [''],
      notes: ['']
    });
    this.wastageForm.get('kitchen_location_id')?.valueChanges.subscribe(() => this.filterMeals());
    this.wastageForm.get('wastage_date')?.valueChanges.subscribe(() => this.filterMeals());
    this.wastageForm.get('meal_type')?.valueChanges.subscribe(() => this.filterFoodItems());
  }

  loadWastageReason() {
    this.wastageService.getWastageDropdownOptions().subscribe((data) => {
      this.wastage_reason = data;
    })
  }

  loadKitchenLocations() {
    this.locationService.getKitchenLocations().subscribe((data) => {
      this.kitchenLocations = data;
    });
  }

  loadDailyMenus() {
    this.dailyMenuService.getDailyMenu().subscribe((menus) => {
      this.dailyMenus = menus;
      this.menusLoaded = true;
    });
  }

  filterMeals() {
    if (!this.menusLoaded) {
      console.warn('Daily menus not loaded yet. Skipping meal filter.');
      return;
    }

    const locationId = this.wastageForm.get('kitchen_location_id')?.value;
    const dateValue = this.wastageForm.get('wastage_date')?.value;

    if (!locationId || !dateValue) {
      return;
    }

    const rawDate = new Date(dateValue);
    const selectedDate = `${rawDate.getFullYear()}-${(rawDate.getMonth() + 1).toString().padStart(2, '0')}-${rawDate.getDate().toString().padStart(2, '0')}`;

    const filteredMenus = this.dailyMenus.filter(
      (menu) =>
        menu.kitchen_location?.id === locationId &&
        menu.date === selectedDate
    );

    this.mealTypes = [...new Set(filteredMenus.map((menu) => menu.meal_type))];

    this.foodItems = [];
    this.wastageForm.patchValue({ meal_type: null, food_item_id: null });
  }

  filterFoodItems() {
    if (!this.menusLoaded) {
      console.warn('Daily menus not loaded yet. Skipping food item filter.');
      return;
    }

    const locationId = this.wastageForm.get('kitchen_location_id')?.value;
    const date = this.wastageForm.get('wastage_date')?.value;
    const mealType = this.wastageForm.get('meal_type')?.value;

    if (!locationId || !date || !mealType) return;

    const rawDate = new Date(date);
    const selectedDate = `${rawDate.getFullYear()}-${(rawDate.getMonth() + 1).toString().padStart(2, '0')}-${rawDate.getDate().toString().padStart(2, '0')}`;

    const menus = this.dailyMenus.filter(
      (menu) =>
        menu.kitchen_location?.id === locationId &&
        menu.date === selectedDate &&
        menu.meal_type === mealType
    );

    this.foodItems = menus.flatMap((m) => m.food_items);
  }


  openAddWastageForm() {
    this.showWastageModal = true;
    this.wastageForm.reset({ unit: 'kg' });
    this.mealTypes = [];
    this.foodItems = [];
  }

  closeModal() {
    this.showWastageModal = false;
  }

  onSubmit() {
    if (this.wastageForm.invalid) {
      Object.keys(this.wastageForm.controls).forEach(key => {
        const control = this.wastageForm.get(key);
        if (control && control.invalid) {
          console.warn(`Control '${key}' is invalid:`, control.errors);
        }
      });
      return;
    }

    const formValue = this.wastageForm.getRawValue();
    const rawDate = new Date(formValue.wastage_date);
    const formattedDate = `${rawDate.getFullYear()}-${(rawDate.getMonth() + 1).toString().padStart(2, '0')}-${rawDate.getDate().toString().padStart(2, '0')}`;

    const payload = {
      ...formValue,
      wastage_date: formattedDate
    };

    if (this.editMode && this.editWastageId) {
      // 🔄 Update
      this.wastageService.updateWastage(this.editWastageId, payload).subscribe({
        next: (response) => {
          this.resetForm();
          this.loadKitchenWastage();
        },
        error: (err) => {
          console.error('❌ Update failed:', err);
        }
      });
    } else {
      // ➕ Add
      this.wastageService.addWastage(payload).subscribe({
        next: (response) => {
          this.resetForm();
          this.loadKitchenWastage();
        },
        error: (err) => {
          console.error('❌ Add failed:', err);
        }
      });
    }
  }

  resetForm() {
    this.wastageForm.reset({ unit: 'kg' });
    this.showWastageModal = false;
    this.editMode = false;
    this.editWastageId = null;
    this.mealTypes = [];
    this.foodItems = [];
  }


  getReasonClass(reason: string): string {
    const className = reason?.toLowerCase().replace(/\s+/g, '-');
    return className || 'other';
  }

  getDisplayReason(reasonKey: string): string {
    const match = this.wastage_reason.find(option => option.key === reasonKey);
    return match ? match.value : reasonKey;
  }

  calculateWastageByReason(): void {
    const reasonMap = new Map<string, { count: number; cost: number }>();

    for (const option of this.wastage_reason) {
      reasonMap.set(option.key, { count: 0, cost: 0 });
    }

    for (const item of this.kitchenWastage) {
      const reason = item.reason || 'other';
      const cost = item.cost || 0;
      if (!reasonMap.has(reason)) {
        reasonMap.set(reason, { count: 0, cost: 0 });
      }

      const current = reasonMap.get(reason);
      if (current) {
        current.count += 1;
        current.cost += cost;
      }
    }
    this.wastageByReason = Array.from(reasonMap.entries())
      .map(([reason, stats]) => ({
        reason,
        count: stats.count,
        cost: stats.cost
      }))
      .sort((a, b) => b.count - a.count);
  }


  editWastage(item: any) {
    this.editMode = true;
    this.editWastageId = item.id;
    this.showWastageModal = true;

    const rawDate = new Date(item.wastage_date);

    // First patch location and date
    this.wastageForm.patchValue({
      kitchen_location_id: item.kitchen_location?.id,
      wastage_date: rawDate,
      unit: item.unit,
      reason: item.reason,
      notes: item.notes,
      quantity: item.quantity
    });

    // Wait for dropdowns to update
    setTimeout(() => {
      this.filterMeals();

      // After mealTypes are loaded
      setTimeout(() => {
        this.wastageForm.patchValue({
          meal_type: item.meal_type
        });

        this.filterFoodItems();

        setTimeout(() => {
          this.wastageForm.patchValue({
            food_item_id: item.food_item?.id
          });
        }, 0);
      }, 0);
    }, 0);
  }

}