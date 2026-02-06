import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem, UnitType, Category, MonthType } from '../../models/inventory-item.model';
import { MasterRecordService } from '../../services/master.record.service';
import { ExcelService } from '../../services/excel.service';
import { LocationService } from '../../services/location.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-full-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  template: `
    <div class="inventory-container fade-in">
      <!-- <app-report-filter
        (filterChange)="onFilterChange($event)"
        (export)="exportToExcel()">
      </app-report-filter> -->
      <div class="page-header">
        <h2 class="page-title">Kitchen Inventory</h2>
        <div class="action-buttons">
          <button class="btn-primary" (click)="openAddItemForm()">Add New Item</button>
          <button class="btn btn-secondary" (click)="showUploadIngridientModal = true">
            <span>📤</span> Upload Inventory Item
          </button>
          <button class="btn btn-secondary" (click)="downloadFilteredExcel()">
            <span>📥</span> Export Inventory Excel
          </button>
        </div>
        <div class="modal" *ngIf="showUploadIngridientModal" (click)="showUploadIngridientModal = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="modal-header">
              <h3 class="modal-title">Upload food item (CSV/Excel)</h3>
              <button class="close-btn" (click)="showUploadIngridientModal = false">✖</button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
              <input
                type="file"
                (change)="onIngridientFileSelected($event)"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="showUploadIngridientModal = false">Cancel</button>
              <button class="btn btn-primary" (click)="uploadSelectedIngridientFile()" [disabled]="!selectedIngridientFile">Upload</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search inventory..." 
            [(ngModel)]="searchTerm"
            (input)="applyFilters()">
        </div>

        <div class="filter-control">
          <select class="form-control" [(ngModel)]="yearFilter" (change)="applyFilters()">
            <option value="">All Years</option>
            <option *ngFor="let year of years" [value]="year">
              {{ year }}
            </option>
          </select>
          <select class="form-control" [(ngModel)]="monthFilter" (change)="applyFilters()">
            <option value="">All Months</option>
            <option *ngFor="let month of months" [value]="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <div class="filter-controls">
         <select class="form-control" [(ngModel)]="categoryFilter" (change)="applyFilters()">
          <option value="">All Categories</option>
          <option *ngFor="let category of categories" [value]="category.category">
            {{ category.category }}
          </option>
        </select>
          <select class="form-control" [(ngModel)]="stockFilter" (change)="applyFilters()">
            <option value="">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="normal">Normal Stock</option>
            <option value="expiring">Expiring Soon</option>
          </select>
          <select
            class="form-control"
            [(ngModel)]="kitchenLocationFilter"
            name="kitchenLocationFilter"
            (change)="applyFilters()"
          >
            <option value="">All Locations</option>
            <option *ngFor="let loc of kitchenLocations" [value]="loc.id">
              {{ loc.name }}
            </option>
          </select>

        </div>
      </div>
      <div class="inventory-table-container">
        <table class="table inventory-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Min. Stock</th>
              <th>Unit</th>
              <th>Purchase Date</th>
              <th>Expiry Date</th>
              <th>Price (Before Tax)</th>
              <th>Tax Amount</th>
              <th>Total Price</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredItems">
              <td>{{ item.name.name }}</td>
              <td>
                <span class="badge badge-primary">{{ item.name.category.category }}</span>
              </td>
              <td>
                <span class="stock-level" [class.critical]="item.current_stock <= item.minimum_stock">
                  {{ item.current_stock }} {{ item.unit }}
                </span>
              </td>
              <td>{{ item.name.minimum_stock }} {{ item.unit }}</td>
              <td>{{ item.unit }}</td>
              <td>{{ item.purchase_date | date:'mediumDate' }}</td>
              <td>{{ item.expiry_date | date:'mediumDate' }}</td>
              <td>{{ item.price_before_tax | currency:'INR':'symbol' }}</td>
              <td>{{ item.tax_amount | currency:'INR':'symbol' }}</td>
              <td>{{ item.purchase_price | currency:'INR':'symbol' }}</td>
              <td>{{ item.kitchen_location.name }}</td>
              <td class="actions-cell">
                <div class="actions-wrapper">
                  <!-- <button class="btn-icon" (click)="editItem(item)">✏️</button> -->
                   <button class="btn-icon" (click)="openExtendExpiryDialog(item)" title="Extend Expiry">🗓️</button>
                   <button class="btn-icon" (click)="openWastageForm(item)">♻️</button>
                  <!-- <button class="btn-icon" (click)="updateStock(item)">🔄</button> -->
                  <button class="btn-icon" (click)="deleteItem(item)">🗑️</button>
                  <!-- <button class="btn-icon" (click)="toggleItemStatus(item)">
                    {{ item.is_active ? '🟢' : '🔴' }}
                  </button> -->
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredItems.length === 0">
              <td colspan="10" class="empty-message">
                No inventory items found. Add some items to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Item Form Modal -->
       <div *ngIf="showItemForm" class="modal" (click)="closeItemForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="close-button" type="button" (click)="closeItemForm()">×</button>
          <h3>{{ isEditing ? 'Edit Item' : 'Add New Item' }}</h3>
          
          <form (ngSubmit)="saveItem()" #itemForm="ngForm">
        <!-- Name Dropdown -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <mat-select [(ngModel)]="currentItem.name" name="name" required (selectionChange)="onItemNameChange()">
            <mat-option *ngFor="let item of inventoryItemsName" [value]="item">{{ item.name }}</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Category Display -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category</mat-label>
            <input matInput [value]="currentItem.name?.category?.category || '—'" readonly>
          </mat-form-field>

        <!-- Unit Display -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Unit</mat-label>
          <input matInput [value]="currentItem.name?.unit || '—'" readonly>
        </mat-form-field>

        <!-- Minimum Stock Display -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Minimum Stock</mat-label>
          <input matInput [value]="currentItem.name?.minimum_stock || '—'" readonly>
        </mat-form-field>

        <!-- Current Stock -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Current Stock</mat-label>
          <input matInput type="number" name="current_stock" [(ngModel)]="currentItem.current_stock" min="0" step="0.01">
        </mat-form-field>

        <!-- Purchase Date -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Purchase Date</mat-label>
          <input matInput [matDatepicker]="purchasePicker" [(ngModel)]="currentItem.purchase_date" name="purchase_date">
          <mat-datepicker-toggle matSuffix [for]="purchasePicker"></mat-datepicker-toggle>
          <mat-datepicker #purchasePicker></mat-datepicker>
        </mat-form-field>

        <!-- Expiry Date -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Expiry Date</mat-label>
          <input matInput [matDatepicker]="expiryPicker" [(ngModel)]="currentItem.expiry_date" name="expiry_date">
          <mat-datepicker-toggle matSuffix [for]="expiryPicker"></mat-datepicker-toggle>
          <mat-datepicker #expiryPicker></mat-datepicker>
        </mat-form-field>

        <!-- Price Before Tax -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Price Before Tax</mat-label>
          <input matInput type="number" name="price_before_tax" [(ngModel)]="currentItem.price_before_tax" min="0" step="0.01" (input)="calculateTotalPrice()">
        </mat-form-field>

        <!-- Tax Percentage -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tax Percentage (%)</mat-label>
          <input matInput type="number" name="tax_percentage" [(ngModel)]="currentItem.tax_percentage" min="0" max="100" step="0.01" (input)="calculateTotalPrice()">
        </mat-form-field>

        <!-- Tax Amount (read-only) -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tax Amount</mat-label>
          <input matInput type="number" name="tax_amount" [(ngModel)]="currentItem.tax_amount" readonly>
        </mat-form-field>

        <!-- Purchase Price (read-only) -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Total Purchase Price</mat-label>
          <input matInput type="number" name="purchase_price" [(ngModel)]="currentItem.purchase_price" readonly>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Total Purchase Quantity</mat-label>
          <input matInput type="number" name="purchase_quantity" [(ngModel)]="currentItem.purchase_quantity">
        </mat-form-field>

        <!-- Kitchen Location Dropdown -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Kitchen Location</mat-label>
          <mat-select name="kitchen_location" [(ngModel)]="currentItem.kitchen_location" required>
            <mat-option *ngFor="let loc of kitchenLocations" [value]="loc">{{ loc.name }}</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Notes -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Notes</mat-label>
          <textarea matInput name="notes" [(ngModel)]="currentItem.notes"></textarea>
        </mat-form-field>

        <!-- Active Checkbox -->
        <mat-checkbox [(ngModel)]="currentItem.is_active" name="is_active">Active</mat-checkbox>

        <!-- Buttons -->
        <div class="form-group">
          <button class="btn-primary">Save</button>
          <button class="btn-primary" (click)="closeItemForm()">Cancel</button>
        </div>
      </form>
  </div>
</div>

<div *ngIf="showExtendExpiryForm" class="modal">
  <div class="modal-content">
    <h3>Extend Expiry</h3>

    <form [formGroup]="extendExpiryForm" (ngSubmit)="submitExtendExpiry()">
      <!-- Readonly field showing item name -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Item Name</mat-label>
        <input matInput [value]="selectedExpiryItem?.name?.name" readonly />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Number of Days</mat-label>
        <input matInput type="number" formControlName="no_days" min="1" />
        <mat-error *ngIf="extendExpiryForm.get('no_days')?.hasError('required')">
          Number of days is required
        </mat-error>
        <mat-error *ngIf="extendExpiryForm.get('no_days')?.hasError('min')">
          Must be at least 1 day
        </mat-error>
      </mat-form-field>

      <div class="modal-actions">
        <button mat-stroked-button type="button" (click)="closeExtendExpiryForm()">Cancel</button>
        <button mat-raised-button [disabled]="extendExpiryForm.invalid">
          Extend
        </button>
      </div>
    </form>
  </div>
</div>


  <!-- Update Stock Modal -->
  <div *ngIf="showStockUpdateForm" class="modal">
    <div class="modal-content">
      <h2>Update Stock</h2>
      <p>Item: {{ currentItem.name?.name }}</p>

      <mat-form-field appearance="outline">
        <mat-label>New Stock Level</mat-label>
        <input matInput type="number" [(ngModel)]="newStockLevel" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Reason</mat-label>
        <mat-select [(ngModel)]="stockUpdateReason">
          <mat-option value="New Purchase">New Purchase</mat-option>
          <mat-option value="Correction">Correction</mat-option>
          <mat-option value="Other">Other</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field *ngIf="stockUpdateReason === 'Other'" appearance="outline">
        <mat-label>Specify Reason</mat-label>
        <input matInput [(ngModel)]="otherReason" />
      </mat-form-field>

      <div class="modal-actions">
        <button mat-flat-button color="primary" (click)="saveStockUpdate()">Save</button>
        <button mat-button (click)="closeStockUpdateForm()">Cancel</button>
      </div>
    </div>
  </div>

<!-- Wastage Modal -->
      <div *ngIf="wastageFormVisible" class="modal" (click)="wastageFormVisible = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="modal-header">
            <h2>Record Inventory Wastage</h2>
            <p class="subtitle">Log expired, damaged, or spoiled items</p>
          </div>

          <!-- Item Info -->
          <div class="item-info-card">
            <div class="info-row">
              <span class="info-label">Item Name</span>
              <span class="info-value">{{ currentItem.name?.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Current Stock</span>
              <span class="info-value current-stock">{{ currentItem.current_stock || 0 }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Unit</span>
              <span class="info-value current-stock">{{ currentItem.unit || 0 }}</span>
            </div>
          </div>

          <!-- Form -->
          <form class="form-section">
            <div *ngIf="errorMessage" class="error-popup">
              {{ errorMessage }}
              <button (click)="errorMessage = null">×</button>
            </div>
            <mat-form-field appearance="outline">
              <mat-label>Wastage Quantity</mat-label>
              <input matInput
                    type="number"
                    [(ngModel)]="wastageQuantity"
                    name="wastageQuantity"
                    min="0"
                    placeholder="Enter quantity to record as wastage">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Reason</mat-label>
              <mat-select [(ngModel)]="wastageReason" name="wastageReason" required>
                <mat-option *ngFor="let r of reasonChoices" [value]="r.key">
                  {{ r.label }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Show this only if 'Other' is selected -->
            <mat-form-field appearance="outline" *ngIf="wastageReason === 'other'">
              <mat-label>Specify Other Reason</mat-label>
              <input
                matInput
                [(ngModel)]="wastageOtherReason"
                name="wastageOtherReason"
                placeholder="Enter custom reason"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date of Wastage</mat-label>
              <input matInput
                    [matDatepicker]="picker"
                    [(ngModel)]="wastageDate"
                    name="wastageDate"
                    placeholder="Choose a date">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Additional Notes</mat-label>
              <textarea matInput
                        [(ngModel)]="wastageNotes"
                        name="wastageNotes"
                        placeholder="Add extra notes here"></textarea>
            </mat-form-field>
          </form>
          <!-- Actions -->
          <div class="modal-actions">
            <button mat-button type="button" (click)="wastageFormVisible = false">
              <mat-icon>close</mat-icon> Cancel
            </button>
            <button mat-flat-button color="warn"
                    (click)="saveWastage()"
                    >
              <mat-icon>save</mat-icon> Record Wastage
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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
    
    .modal-body {
        margin-bottom: 24px;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 16px;
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
    .full-width{
      width: 100%;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .form-group label {
      margin-bottom: 6px;
      font-weight: 600;
    }

    .form-group:last-of-type {
      flex-direction: row;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    .form-group textarea {
      min-height: 80px;
      resize: vertical;
    }

    .form-group button {
      margin-right: 10px;
      padding: 8px 16px;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .form-group button[type="button"] {
      background-color: #6c757d;
    }

    .form-group button:hover {
      opacity: 0.9;
    }

    .inventory-container {
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
    
    .page-title {
      margin: 0;
      color: var(--neutral-800);
    }

    .action-buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
    }

    .filters {
      display: flex;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
      flex-wrap: wrap;
    }
    
    .search-box {
      flex: 1;
      min-width: 250px;
    }
    
    .filter-controls {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }
    
    .filter-controls select {
      min-width: 150px;
    }
    
    .inventory-table-container {
      background-color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      margin-bottom: var(--space-4);
    }
    
    .inventory-table {
      width: 100%;
      margin-bottom: 0;
    }
    
    .inventory-table th {
      background-color: var(--neutral-100);
      padding: var(--space-2) var(--space-3);
      font-weight: 500;
      color: var(--neutral-700);
    }
    
    .inventory-table td {
      padding: var(--space-2) var(--space-3);
      vertical-align: middle;
    }
    
    .stock-level {
      font-weight: 500;
    }
    
    .stock-level.critical {
      color: var(--error);
    }
    
    .expiring {
      color: var(--error);
      font-weight: 500;
    }
    
    .actions-cell {
      white-space: nowrap;
      padding: 0.5rem;
    }

    .actions-wrapper {
      display: flex;
      flex-wrap: nowrap;
      gap: 0.5rem;
      align-items: center;
      justify-content: center;
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
      padding: var(--space-4);
      color: var(--neutral-500);
    }

    .form-group {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      margin-bottom: 5px;
    }

    /* Buttons */
    .form-group button {
      margin-right: 10px;
    }

    button[type="submit"] {
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 5px;
    }

    button[type="button"] {
      background-color: #999;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 5px;
    }

    body.modal-open {
      overflow: hidden;
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }
    
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: var(--space-2);
      }
      
      .inventory-table {
        display: block;
        overflow-x: auto;
      }
    }


    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 1px solid #e2e8f0;
        margin-bottom: 16px;
      }

      .modal-header h2 {
        font-size: 24px;
        font-weight: 600;
        color: #333333;
        margin: 0 0 8px 0;
        letter-spacing: -0.02em;
      }

      .modal-header .subtitle {
        color: #666666;
        font-size: 14px;
        margin: 0;
        font-weight: 400;
      }

      /* Item Information Card */
      .item-info-card {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .info-label {
        font-weight: 500;
        color: #495057;
        font-size: 14px;
      }

      .info-value {
        font-weight: 600;
        color: #212529;
        font-size: 14px;
      }

      /* Form Section */
      .form-section {
        margin-bottom: 24px;
      }

      .form-section mat-form-field {
        width: 100%;
        margin-bottom: 16px;
      }

      .form-section mat-form-field:last-child {
        margin-bottom: 0;
      }

      /* Action Buttons */
      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #f0f0f0;
      }

      .modal-actions button {
        min-width: 120px;
        height: 40px;
        border-radius: 6px;
        font-weight: 500;
        text-transform: none;
        font-size: 14px;
        transition: all 0.2s ease;
      }

      .modal-actions .mat-mdc-button {
        background: #ffffff;
        color: #6c757d;
        border: 1px solid #dee2e6;
      }

      .modal-actions .mat-mdc-button:hover {
        background: #f8f9fa;
        border-color: #adb5bd;
        color: #495057;
      }

      .modal-actions .mat-mdc-unelevated-button {
        background: #0d6efd;
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(13, 110, 253, 0.2);
      }

      .modal-actions .mat-mdc-unelevated-button:hover:not([disabled]) {
        background: #0b5ed7;
        box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
        transform: translateY(-1px);
      }

      .modal-actions .mat-mdc-unelevated-button[disabled] {
        background: #e9ecef;
        color: #6c757d;
        box-shadow: none;
      }

      /* Material Icons in buttons */
      .modal-actions button mat-icon {
        margin-right: 8px;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      /* Responsive Design */
      @media (max-width: 600px) {
        .modal-content {
          padding: 20px 16px;
          margin: 16px;
          width: calc(100% - 32px);
          border-radius: 8px;
        }
        
        .modal-actions {
          flex-direction: column-reverse;
          gap: 8px;
        }
        
        .modal-actions button {
          width: 100%;
          min-width: unset;
        }
        
        .info-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        
        .info-row:not(:last-child) {
          padding-bottom: 12px;
          margin-bottom: 8px;
        }
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
  `]
})

export class fullInventoryComponent implements OnInit {
  inventoryItemsName: any[] = [];
  inventoryItems: any[] = [];
  filteredItems: any[] = [];
  categories: Category[] = [];
  reasonChoices: any[] = [];

  searchTerm = '';
  categoryFilter = '';
  stockFilter = '';
  monthFilter = '';
  yearFilter: string = '';
  kitchenLocationFilter: string = '';

  selectedIngridientFile: File | null = null;
  showUploadIngridientModal = false;
  showItemForm = false;
  isEditing = false;
  currentItem: Partial<InventoryItem> = {};

  showStockUpdateForm = false;
  newStockLevel = 0;
  stockUpdateReason = 'New Purchase';
  otherReason = '';
  kitchenLocations: any[] = [];

  wastageFormVisible = false;
  wastageQuantity: number | null = null;
  wastageReason: string = '';
  wastageNotes: string = '';
  wastageOtherReason: string = '';
  wastageDate: string = new Date().toISOString().split('T')[0];


  units = Object.values(UnitType);
  months = Object.values(MonthType)
  years: string[] = [];

  errorMessage: string | null = null;

  extendExpiryForm: FormGroup;
  showExtendExpiryForm: boolean = false;
  selectedExpiryItem: any;


  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private excelService: ExcelService,
    private masterRecordService: MasterRecordService,
    private locationService: LocationService
  ) {
    this.extendExpiryForm = this.fb.group({
      no_days: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const now = new Date();
    this.monthFilter = (now.getMonth() + 1).toString(); // 1-based month
    const currentYear = now.getFullYear();
    const startYear = 2022;
    this.years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => (startYear + i).toString());
    this.yearFilter = currentYear.toString();
    this.loadInventoryItemsName();
    this.loadInventoryItems();
    this.loadKitchenLocations();
    this.loadDropdownOptions();
    this.loadCategories();
  }

  loadKitchenLocations(): void {
    this.locationService.getKitchenLocations().subscribe({
      next: (data) => {
        this.kitchenLocations = data;
      },
      error: (err) => {
        console.error('Failed to fetch kitchen locations', err);
      }
    });
  }

  loadInventoryItemsName(): void {
    this.masterRecordService.getInventoryItemName().subscribe(items => {
      this.inventoryItemsName = items;
      this.applyFilters();
    });
  }
  loadInventoryItems(): void {
    this.inventoryService.getInventoryItems().subscribe(items => {
      this.inventoryItems = items;
      this.applyFilters();
    });
  }

  loadCategories(): void {
    this.masterRecordService.getCategories().subscribe((data) => {
      this.categories = data.filter(cat => cat.is_active); // Optional: only active
    });
  }

  onFilterChange(filter: { month: number, year: number }): void {
    this.inventoryService.getMonthlyReport(filter.month, filter.year)
      .subscribe(items => {
        this.inventoryItems = items;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    let filtered = [...this.inventoryItems];

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.name.toLowerCase().includes(search) ||
        item.name.category.category.toLowerCase().includes(search) ||
        (item.notes && item.notes.toLowerCase().includes(search))
      );
    }

    if (this.categoryFilter) {
      filtered = filtered.filter(item => item.name.category.category === this.categoryFilter);
    }

    if (this.stockFilter) {
      switch (this.stockFilter) {
        case 'low':
          filtered = filtered.filter(item => item.current_stock <= item.name.minimum_stock);
          break;
        case 'normal':
          filtered = filtered.filter(item => item.current_stock > item.name.minimum_stock);
          break;
        case 'expiring':
          filtered = filtered.filter(item => this.isExpiringSoon(item.expiry_date));
          break;
      }
    }

    if (this.monthFilter !== '') {
      filtered = filtered.filter(item => {
        const purchaseDate = new Date(item.purchase_date);
        return (purchaseDate.getMonth() + 1).toString() === this.monthFilter;
      });
    }

    if (this.yearFilter !== '') {
      filtered = filtered.filter(item => {
        const purchaseDate = new Date(item.purchase_date);
        return purchaseDate.getFullYear().toString() === this.yearFilter;
      });
    }

    if (this.kitchenLocationFilter) {
      filtered = filtered.filter(item =>
        item.kitchen_location?.id?.toString() === this.kitchenLocationFilter.toString()
      );
    }

    this.filteredItems = filtered;
  }

  isExpiringSoon(expiryDate?: Date): boolean {
    if (!expiryDate) return false;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 7;
  }

  onIngridientFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedIngridientFile = input.files[0];
    }
  }

  uploadSelectedIngridientFile(): void {
    if (!this.selectedIngridientFile) return;

    this.inventoryService.uploadInventoryItem(this.selectedIngridientFile).subscribe({
      next: () => {
        alert('Upload successful!');
        this.showUploadIngridientModal = false;
        this.selectedIngridientFile = null;
      },
      error: () => {
        alert('Upload failed.');
      }
    });
  }

  openAddItemForm(): void {
    this.isEditing = false;
    this.showStockUpdateForm = false;

    this.currentItem = {
      name: undefined, // will be set to item.id
      kitchen_location: undefined,
      unit: '',
      purchase_date: new Date(),
      expiry_date: undefined,
      price_before_tax: undefined,
      tax_percentage: 18,
      tax_amount: undefined,
      purchase_price: undefined,
      current_stock: undefined,
      minimum_stock: undefined,
      purchase_quantity: undefined,
      is_active: true,
      notes: ''
    };

    this.showItemForm = true;
    document.body.classList.add('modal-open');
  }


  closeItemForm(): void {
    this.showItemForm = false;
    document.body.classList.remove('modal-open');
  }

  calculateTotalPrice(): void {
    if (this.currentItem.price_before_tax && this.currentItem.tax_percentage) {
      this.currentItem.tax_amount = (this.currentItem.price_before_tax * this.currentItem.tax_percentage) / 100;
      this.currentItem.purchase_price = this.currentItem.price_before_tax + this.currentItem.tax_amount;
    }
  }

  editItem(item: InventoryItem): void {
    this.isEditing = true;
    this.showStockUpdateForm = false;

    this.currentItem = { ...item };
    this.showItemForm = true;
  }

  saveItem(): void {
    if (!this.currentItem.name || !this.currentItem.kitchen_location) {
      alert('Please fill in all required fields including kitchen location');
      return;
    }

    const formatDate = (date?: Date) =>
      date ? date.toISOString().split('T')[0] : null;

    const formatNumber = (value?: number, decimals = 2) => {
      if (value === undefined || value === null) return '0';
      return value.toFixed(decimals);  // ensures 2 decimal places
    };

    const payload = {
      name_id: this.currentItem.name.id,
      kitchen_location_id: this.currentItem.kitchen_location.id,
      purchase_date: formatDate(this.currentItem.purchase_date),
      expiry_date: formatDate(this.currentItem.expiry_date),
      price_before_tax: formatNumber(this.currentItem.price_before_tax),
      tax_percentage: formatNumber(this.currentItem.tax_percentage, 2),
      tax_amount: formatNumber(this.currentItem.tax_amount, 2),
      purchase_price: formatNumber(this.currentItem.purchase_price, 2),
      current_stock: this.currentItem.current_stock?.toString() ?? '0',
      purchase_quantity: this.currentItem.purchase_quantity,
      notes: this.currentItem.notes || '',
      is_active: this.currentItem.is_active ?? true,
    };

    if (this.isEditing && this.currentItem.id) {
      this.inventoryService.updateInventoryItem(this.currentItem.id, payload).subscribe(() => {
        this.loadInventoryItems();
        this.closeItemForm();
      });
    } else {
      this.inventoryService.addInventoryItem(payload).subscribe(() => {
        this.loadInventoryItems();
        this.closeItemForm();
      });
    }
  }

  openExtendExpiryDialog(item: any): void {
    this.selectedExpiryItem = item;
    this.extendExpiryForm.reset();  // Clear previous values
    this.showExtendExpiryForm = true;
  }

  closeExtendExpiryForm(): void {
    this.showExtendExpiryForm = false;
    this.selectedExpiryItem = null;
  }

  submitExtendExpiry(): void {
    if (!this.extendExpiryForm.valid || !this.selectedExpiryItem?.id) return;

    const no_days = this.extendExpiryForm.value.no_days;
    this.inventoryService.updateInventoryExpiryDate(this.selectedExpiryItem.id, no_days).subscribe({
      next: () => {
        this.closeExtendExpiryForm();
        this.loadInventoryItems(); // Refresh list
      },
      error: (err) => {
        console.error('Failed to extend expiry:', err);
      }
    });
  }


  updateStock(item: any): void {
    this.showItemForm = false;
    this.currentItem = { ...item };
    this.newStockLevel = item.current_stock;
    this.stockUpdateReason = 'New Purchase';
    this.otherReason = '';
    this.showStockUpdateForm = true;
  }

  closeStockUpdateForm(): void {
    this.showStockUpdateForm = false;
  }

  saveStockUpdate(): void {
    if (this.currentItem.id) {
      const reason = this.stockUpdateReason === 'Other' ? this.otherReason : this.stockUpdateReason;

      const updatedItem: InventoryItem = {
        ...(this.currentItem as InventoryItem),
        id: this.currentItem.id as number,
        current_stock: this.newStockLevel,
        last_updated: new Date(),
        notes: `${this.currentItem.notes || ''}\nStock updated from ${this.currentItem.current_stock} to ${this.newStockLevel} - Reason: ${reason} (${new Date().toLocaleString()})`.trim()
      };

      this.inventoryService.updateInventoryItem(this.currentItem.id, updatedItem).subscribe(() => {
        this.loadInventoryItems();
        this.closeStockUpdateForm();
      });
    }
  }

  loadDropdownOptions(): void {
    this.inventoryService.getWastageDropdownOptions().subscribe({
      next: (res) => {
        this.reasonChoices = res;
      },
      error: (err) => {
        console.error('Failed to load dropdown options:', err);
      }
    });
  }


  openWastageForm(item: any): void {
    this.currentItem = { ...item };
    this.wastageQuantity = null;
    this.wastageReason = '';  // reset selection
    this.wastageNotes = '';
    this.wastageDate = new Date().toISOString().split('T')[0];
    this.wastageFormVisible = true;
  }

  saveWastage(): void {
    if (
      !this.currentItem?.id ||
      this.wastageQuantity === null ||
      this.wastageQuantity === undefined ||
      !this.wastageReason
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const currentStock = this.currentItem.current_stock ?? 0;

    if (this.wastageQuantity > currentStock) {
      this.errorMessage = `Wastage quantity ${this.wastageQuantity} cannot exceed current stock ${currentStock}.`;
      return;
    }

    if (this.wastageReason === 'other' && !this.wastageOtherReason?.trim()) {
      this.errorMessage = 'Please specify a reason for "Other".';
      return;
    }

    const payload: any = {
      inventory_item_id: this.currentItem.id,
      quantity: this.wastageQuantity.toFixed(2),
      reason: this.wastageReason,  // Always send one of: expired, spoiled, damaged, other
      wastage_date: this.wastageDate,
      notes: this.wastageNotes
    };

    if (this.wastageReason === 'other') {
      payload.reason_other = this.wastageOtherReason.trim();
    }

    this.errorMessage = '';
    this.inventoryService.recordWastage(payload).subscribe({
      next: () => {
        this.wastageFormVisible = false;
        this.loadInventoryItems();
      },
      error: (err) => {
        this.errorMessage = 'Failed to save wastage. Please try again.';
        console.error(err);
      }
    });
  }


  toggleItemStatus(item: InventoryItem): void {
    const updatedItem: InventoryItem = {
      ...item,
      is_active: !item.is_active
    };
  }

  deleteItem(item: InventoryItem): void {
    const confirmed = confirm(`Are you sure you want to delete "${item.name}"?`);
    if (confirmed && item.id) {
      this.inventoryService.deleteInventoryItem(item.id).subscribe(() => {
        this.loadInventoryItems();
      });
    }
  }
  exportToExcel(): void {
    const data = this.filteredItems.map(item => ({
      'Item Name': item.name.name,
      'Kicthen': item.kitchen_location.name,
      'Category': item.category,
      'Quantity': item.quantity,
      'Unit': item.unit,
      'Purchase Date': new Date(item.purchase_date).toLocaleDateString(),
      'Purchase Price': item.purchase_price,
      'Current Stock': item.current_stock,
      'Minimum Stock': item.minimum_stock
    }));
    this.excelService.exportToExcel(data, 'inventory_report');
  }

  onItemNameChange(): void {
    const selectedName = this.currentItem.name;

    if (selectedName) {
      // Set category
      this.currentItem.category = selectedName.category?.category
        ? selectedName.category
        : undefined;

      // Set unit
      this.currentItem.unit = selectedName.unit;

      // Set minimum stock
      this.currentItem.minimum_stock = Number(selectedName.minimum_stock);
    }
  }

  downloadFilteredExcel(): void {
    this.inventoryService.exportInventory(
      this.monthFilter,
      this.yearFilter,
      this.kitchenLocationFilter
    ).subscribe({
      next: (blob) => {
        if (!blob || (blob as any).size === 0) {
          alert('No inventory data found for the selected filters.');
          return;
        }

        const blobType = blob.type;

        if (blobType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          const reader = new FileReader();
          reader.onload = () => {
            const errorMessage = reader.result || 'Unexpected error';
            console.error('Error in export:', errorMessage);
            alert('Failed to export inventory: ' + errorMessage);
          };
          reader.readAsText(blob);
          return;
        }

        const fileName = `Inventory_${this.kitchenLocationFilter || 'All'}_${this.monthFilter || 'All'}_${this.yearFilter || 'All'}.xlsx`;
        saveAs(blob, fileName);
      },
      error: (err) => {
        console.error('Export failed:', err);
        alert('Failed to export inventory Excel file.');
      }
    });
  }

}