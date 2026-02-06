import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WastageService } from '../../services/wastage.service';
import { InventoryService } from '../../services/inventory.service';
import { Wastage, WastageReason } from '../../models/wastage.model';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-wastage',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatSelectModule, MatIconModule],
  template: `
    <div class="container fade-in">
      <div class="page-header">
        <h2>Wastage Management</h2>
      </div>

      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Total Items</h3>
            <p class="stat-value">{{ inventoryWastage.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon error">💰</div>
          <div class="stat-content">
            <h3>Total Cost</h3>
            <p class="stat-value">{{ getTotalCost() | currency:'INR':'symbol' }}</p>
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
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of inventoryWastage">
                <td>{{ item.inventory_item.name.name }}</td>
                <td>{{ item.quantity }} {{ item.unit }}</td>
                <td>
                  <span class="badge" [class]="'badge-' + getReasonClass(item.reason)">
                    {{ item.reason }}
                  </span>
                </td>
                <td>{{ item.wastage_date | date:'mediumDate' }}</td>
                <td>{{ item.inventory_item.kitchen_location.name }}</td>
                <td>{{ item.cost | currency:'INR':'symbol' }}</td>
                <td>
                  <button class="btn-icon" (click)="editWastage(item)">✏️</button>
                  <!-- <button class="btn-icon" (click)="deleteInventoryWastage(item.id)">🗑️</button> -->
                </td>
              </tr>
              <tr *ngIf="inventoryWastage.length === 0">
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
              <p class="cost">{{ stat.cost | currency:'INR':'symbol' }}</p>
            </div>
          </div>
        </div>

      <!-- Add/Edit Wastage Modal -->
    <div class="modal" *ngIf="showWastageForm">
      <div class="modal" *ngIf="showWastageForm">
        <div class="modal-content slide-in-up mat-elevation-z4">
          <div class="modal-header flex justify-between items-center">
            <h3>{{ isEditing ? 'Edit Wastage Record' : 'Record New Wastage' }}</h3>
            <button mat-icon-button (click)="closeWastageForm()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="modal-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Item</mat-label>
              <input matInput [value]="selectedInventoryItem?.name?.name" disabled>        
            </mat-form-field>

            <mat-label *ngIf="selectedInventoryItem">
                Available: {{ selectedInventoryItem.current_stock }} {{ selectedInventoryItem.unit }}
            </mat-label>

            <div class="form-row flex gap-4">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Wastage Quantity</mat-label>
                <input
                  matInput
                  type="number"
                  [(ngModel)]="currentWastage.quantity"
                  [max]="selectedInventoryItem?.current_stock || 0"
                >
              </mat-form-field>

              <mat-label>Unit: {{ selectedInventoryItem?.unit }}</mat-label>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Reason</mat-label>
                <mat-select [(ngModel)]="currentWastage.reason">
                  <mat-option *ngFor="let option of wastageReasonOptions" [value]="option.key">
                    {{ option.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes</mat-label>
              <textarea
                matInput
                [(ngModel)]="currentWastage.notes"
                placeholder="Enter reason for wastage"
              ></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date</mat-label>
              <input
                matInput
                type="date"
                [(ngModel)]="currentWastage.wastage_date"
              >
            </mat-form-field>
          </div>

          <div class="modal-footer flex justify-end gap-2">
            <button mat-stroked-button color="warn" (click)="closeWastageForm()">Cancel</button>
            <button mat-flat-button color="primary" (click)="saveWastage()">
              {{ isEditing ? 'Update' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
    .reason-spoiled { background: #FCE4EC; }
    .reason-overcooked { background: #F3E5F5; }
    .reason-leftovers { background: #E8EAF6; }
    .reason-damaged { background: #E3F2FD; }
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

    .cost {
      color: var(--neutral-600);
      margin: 0;
    }

    .badge {
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
    }

    .badge-expired { background: #FFEBEE; color: #C62828; }
    .badge-spoiled { background: #FCE4EC; color: #AD1457; }
    .badge-overcooked { background: #F3E5F5; color: #6A1B9A; }
    .badge-leftovers { background: #E8EAF6; color: #283593; }
    .badge-damaged { background: #E3F2FD; color: #1565C0; }
    .badge-preparation { background: #E0F7FA; color: #00838F; }
    .badge-other { background: #F5F5F5; color: #424242; }

    .empty-message {
      text-align: center;
      padding: var(--space-3);
      color: var(--neutral-500);
    }

    .form-text {
      display: block;
      margin-top: var(--space-1);
      font-size: 0.875rem;
      color: var(--neutral-600);
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }
    }

    .full-width{
      width: 100%;
    }
  `]
})
export class InventoryWastageComponent implements OnInit {
  wastageItems: Wastage[] = [];
  wastageByReason: { reason: string; count: number; cost: number }[] = [];
  wastageReasonOptions: {
    label: any; key: string, value: string
  }[] = [];
  inventoryItems: any[] = [];

  showWastageForm = false;
  isEditing = false;
  currentWastage: Partial<Wastage> = {};
  selectedInventoryItem: any | null = null;
  kitchenLocations: any[] = [];
  foodItems: any[] = [];
  inventoryWastage: any[] = [];
  errorMessage: string = '';


  constructor(
    private wastageService: WastageService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this.loadInventoryWastage();
    this.loadDropdownOptionsAndWastage();
  }

  loadInventoryWastage(): void {
    this.inventoryService.getInventoryWastage().subscribe(items => {
      this.inventoryWastage = items;

    });
  }

  loadDropdownOptionsAndWastage(): void {
    this.inventoryService.getWastageDropdownOptions().subscribe(options => {
      this.wastageReasonOptions = options;

      // Now load wastage only after dropdown options are available
      this.inventoryService.getInventoryWastage().subscribe(data => {
        this.inventoryWastage = data;
        this.calculateWastageByReason();
      });
    });
  }

  calculateWastageByReason(): void {
    const reasonMap = new Map<string, { count: number; cost: number }>();

    for (const option of this.wastageReasonOptions) {
      reasonMap.set(option.key, { count: 0, cost: 0 });
    }

    for (const item of this.inventoryWastage) {
      const reason = item.reason;
      const cost = item.cost || 0;

      if (!reason) continue;

      const current = reasonMap.get(reason)!;
      current.count++;
      current.cost += cost;
    }
    this.wastageByReason = Array.from(reasonMap.entries())
      .map(([reason, stats]) => ({
        reason,
        count: stats.count,
        cost: stats.cost
      }))
      .sort((a, b) => b.count - a.count);
  }


  getTotalCost(): number {
    return this.inventoryWastage.reduce((total, item) => {
      const cost = parseFloat(item.cost as any);
      return total + (isNaN(cost) ? 0 : cost);
    }, 0);
  }


  getReasonClass(reason: string): string {
    const className = reason?.toLowerCase().replace(/\s+/g, '-');
    return className || 'other';
  }

  getDisplayReason(reasonKey: string): string {
    const match = this.wastageReasonOptions.find(option => option.key === reasonKey);
    return match ? match.value : reasonKey;
  }

  openAddWastageForm(): void {
    this.isEditing = false;
    this.currentWastage = {
      date: new Date(),
      reason: WastageReason.OTHER
    };
    this.selectedInventoryItem = null;
    this.showWastageForm = true;
  }

  editWastage(wastage: any): void {
    this.isEditing = true;
    this.showWastageForm = true;

    this.selectedInventoryItem = wastage.inventory_item || null;

    this.currentWastage = {
      id: wastage.id,
      itemId: wastage.inventory_item?.id,
      itemName: wastage.inventory_item?.name?.name,
      unit: wastage.unit || wastage.inventory_item?.unit,
      quantity: +wastage.quantity,
      reason: wastage.reason,
      notes: wastage.notes || '',
      cost: +wastage.cost || 0,
      wastage_date: wastage.wastage_date
        ? wastage.wastage_date.slice(0, 10)
        : new Date().toISOString().slice(0, 10)
    };
  }

  saveWastage(): void {
    if (
      !this.selectedInventoryItem?.id ||
      this.currentWastage.quantity == null ||
      this.currentWastage.quantity <= 0 ||
      !this.currentWastage.reason
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const currentStock = this.selectedInventoryItem.current_stock ?? 0;

    if (this.currentWastage.quantity > currentStock) {
      this.errorMessage = `Wastage quantity ${this.currentWastage.quantity} cannot exceed current stock ${currentStock}.`;
      return;
    }

    const wastagePayload = {
      id: this.currentWastage.id,
      inventory_item_id: this.selectedInventoryItem?.id,  // ✅ correct key name
      quantity: this.currentWastage.quantity,
      reason: this.currentWastage.reason,
      notes: this.currentWastage.notes || '',
      cost: this.currentWastage.cost,
      wastage_date: this.currentWastage.wastage_date,
    };


    if (this.isEditing) {
      this.inventoryService.updateWastage(this.currentWastage.id!, wastagePayload).subscribe({
        next: () => {
          this.loadInventoryWastage();
          this.showWastageForm = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to update wastage.';
          console.error(err);
        },
      });
    }
  }

  calculateCost(): void {
    const quantity = Number(this.currentWastage.quantity);
    const purchasePrice = Number(this.selectedInventoryItem?.purchase_price);
    this.currentWastage.cost = quantity * purchasePrice;
  }

  closeWastageForm(): void {
    this.showWastageForm = false;
    this.currentWastage = {};
    this.selectedInventoryItem = null;
  }

  // editWastage(wastage: Wastage): void {
  //   this.isEditing = true;
  //   this.currentWastage = { ...wastage };
  //   this.selectedInventoryItem = this.inventoryItems.find(item => item.id === wastage.itemId) || null;
  //   this.showWastageForm = true;
  // }

  // closeWastageForm(): void {
  //   this.showWastageForm = false;
  //   this.currentWastage = {};
  //   this.selectedInventoryItem = null;
  // }

  onInventoryItemSelect(): void {
    if (this.selectedInventoryItem) {
      this.currentWastage.itemId = this.selectedInventoryItem.id;
      this.currentWastage.itemName = this.selectedInventoryItem.name.name;
      this.currentWastage.unit = this.selectedInventoryItem.unit;
      this.currentWastage.quantity = 0;
      this.calculateCost();
    }
  }

  // calculateCost(): void {
  //   if (this.selectedInventoryItem && this.currentWastage.quantity) {
  //     const unitCost = this.selectedInventoryItem.purchase_price / this.selectedInventoryItem.quantity;
  //     this.currentWastage.cost = unitCost * this.currentWastage.quantity;
  //   } else {
  //     this.currentWastage.cost = 0;
  //   }
  // }

  isFormValid(): boolean {
    return !!(
      this.selectedInventoryItem &&
      this.currentWastage.quantity &&
      this.currentWastage.quantity > 0 &&
      this.currentWastage.quantity <= this.selectedInventoryItem.current_stock &&
      this.currentWastage.reason
    );
  }

  // saveWastage(): void {
  //   if (!this.isFormValid()) return;

  //   if (this.isEditing && this.currentWastage.id) {
  //     this.wastageService
  //       .updateWastageItem(this.currentWastage as Wastage)
  //       .subscribe(() => {
  //         this.loadWastageData();
  //         this.closeWastageForm();

  //         // Update inventory
  //         if (this.selectedInventoryItem) {
  //           const updatedStock = {
  //             ...this.selectedInventoryItem,
  //             currentStock: this.selectedInventoryItem.current_stock - (this.currentWastage.quantity || 0)
  //           };
  //           this.inventoryService.updateInventoryItem(updatedStock).subscribe();
  //         }
  //       });
  //   } else {
  //     this.wastageService
  //       .addWastageItem(this.currentWastage as Omit<Wastage, 'id'>)
  //       .subscribe(() => {
  //         this.loadWastageData();
  //         this.closeWastageForm();

  //         // Update inventory
  //         if (this.selectedInventoryItem) {
  //           const updatedStock = {
  //             ...this.selectedInventoryItem,
  //             currentStock: this.selectedInventoryItem.current_stock - (this.currentWastage.quantity || 0)
  //           };
  //           this.inventoryService.updateInventoryItem(this.currentItem.id, updatedItem).subscribe();
  //         }
  //       });
  //   }
  // }

  deleteInventoryWastage(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.inventoryService.deleteInventoryWastage(id).subscribe(() => {
        this.loadInventoryWastage();
      });
    }
  }
}