import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterRecordService } from '../../services/master.record.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { UnitType } from '../../models/inventory-item.model';
import { MatSelectModule } from "@angular/material/select";


@Component({
  selector: 'app-master-record',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule],
  template: `
      <div class="inventory-container">
        <!-- Inventory Items Section -->
        <section class="management-section">
  <div class="section-header">
    <h2 class="section-title">
      <span class="section-icon">📦</span>
      Inventory Items
    </h2>
    <div class="button-group">
      <button class="btn btn-primary" (click)="showAddItemModal = true">
        <span>+</span>
        Add
      </button>
      <button class="btn btn-secondary" (click)="showUploadModal = true">
        <span>📤</span>
        Upload
      </button>
      <button class="btn btn-secondary" (click)="showItemListModal = true">
        <span>📋</span>
        View
      </button>
    </div>
  </div>

  <!-- Add Inventory Item Modal -->
  <div class="modal" *ngIf="showAddItemModal" (click)="showAddItemModal = false">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <h3 class="modal-title">Add New Inventory Item</h3>
        <button mat-icon-button (click)="showAddItemModal = false">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <form (ngSubmit)="addNewInventoryItemName()" #itemForm="ngForm">
        <div class="modal-body">
          <!-- Item Name -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Item Name</mat-label>
            <input matInput name="inventoryItem" [(ngModel)]="newInventoryItemName" required placeholder="Enter inventory item name" />
          </mat-form-field>

          <!-- Unit -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Unit</mat-label>
            <mat-select [(ngModel)]="newInventoryItemUnit" name="unit" required>
              <mat-option *ngFor="let unit of units" [value]="unit">{{ unit }}</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Category -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="newInventoryItemCategory" name="category" required>
              <mat-option *ngFor="let category of categories" [value]="category">{{ category.category }}</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Minimum Stock -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Minimum Stock</mat-label>
            <input matInput type="number" name="minimumStock" [(ngModel)]="newInventoryItemMinimumStock" required placeholder="Enter minimum stock" min="0" />
          </mat-form-field>
        </div>
        <div class="modal-footer">
          <button mat-button type="button" (click)="showAddItemModal = false">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="!itemForm.valid">Add Item</button>
        </div>
      </form>
    </div>
  </div>

  <!-- View Inventory Items Modal -->
  <div class="modal" *ngIf="showItemListModal" (click)="showItemListModal = false">
    <div class="modal-content large-modal" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <h3 class="modal-title">Inventory Items</h3>
        <button class="close-button" (click)="showItemListModal = false">×</button>
      </div>
      <div class="modal-body">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Unit</th>
                <th>Category</th>
                <th>Minimum Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of inventoryItemName; let i = index">
                <td>{{ i + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ item.category?.category || '—' }}</td>
                <td>{{ item.minimum_stock ?? '—' }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon edit" (click)="setEditInventoryItem(item)" title="Edit">✏️</button>
                    <button class="btn-icon delete" (click)="deleteInventoryItem(item.id)" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" (click)="showItemListModal = false">Close</button>
      </div>
    </div>
  </div>

  <!-- Upload CSV/Excel Modal -->
  <div class="modal" *ngIf="showUploadModal" (click)="showUploadModal = false">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <h3 class="modal-title">Upload Inventory Items (CSV/Excel)</h3>
        <button mat-icon-button (click)="showUploadModal = false">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="modal-body">
        <input type="file" (change)="onFileSelected($event)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      </div>
      <div class="modal-footer">
        <button mat-button (click)="showUploadModal = false">Cancel</button>
        <button mat-flat-button color="primary" (click)="uploadSelectedFile()" [disabled]="!selectedFile">Upload</button>
      </div>
    </div>
  </div>
</section>


        <!-- Categories Section -->
      <section class="management-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon">🏷️</span>
            Categories
          </h2>
          <div class="button-group">
            <button class="btn btn-primary" (click)="showAddModal = true">
              <span>+</span>
              Add
            </button>
            <button class="btn btn-secondary" (click)="showListModal = true">
              <span>📋</span>
              View
            </button>
          </div>
        </div>

        <!-- Add Category Modal -->
        <div class="modal" *ngIf="showAddModal" (click)="showAddModal = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center;">
              <h3 class="modal-title">Add New Category</h3>
              <button mat-icon-button class="close-button" (click)="showAddModal = false">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <form (ngSubmit)="addNewCategory()" #catForm="ngForm">
              <div class="modal-body">
                <div class="form-row">
                  <div class="form-group">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Category Name</mat-label>
                      <input
                        matInput
                        id="category"
                        type="text"
                        name="category"
                        [(ngModel)]="newCategory"
                        required
                        placeholder="Enter category name"
                      />
                    </mat-form-field>
                  </div>
                </div>
              </div>

              <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px;">
                <button mat-button type="button" (click)="showAddModal = false">Cancel</button>
                <button mat-flat-button color="primary" type="submit" [disabled]="!catForm.valid">
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Categories List Modal -->
        <div class="modal" *ngIf="showListModal" (click)="showListModal = false">
          <div class="modal-content large-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">Categories</h3>
              <button class="close-button" (click)="showListModal = false">×</button>
            </div>
            <div class="modal-body">
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let cat of categories; let i = index">
                      <td>{{ i + 1 }}</td>
                      <td>
                        <div class="item-row">
                          <ng-container *ngIf="editCategoryId !== cat.id; else editMode">
                            <span class="item-text">{{ cat.category }}</span>
                          </ng-container>
                          <ng-template #editMode>
                            <input
                              [(ngModel)]="editCategoryName"
                              class="edit-input"
                              placeholder="Enter category name"
                            />
                          </ng-template>
                        </div>
                      </td>
                      <td>
                        <div class="action-buttons">
                          <ng-container *ngIf="editCategoryId !== cat.id; else editActions">
                            <button class="btn-icon edit" (click)="setEditCategory(cat)" title="Edit">✏️</button>
                            <button class="btn-icon delete" (click)="deleteCategory(cat.id)" title="Delete">🗑️</button>
                          </ng-container>
                          <ng-template #editActions>
                            <button class="btn-icon save" (click)="saveCategoryEdit()" title="Save">💾</button>
                            <button class="btn-icon cancel" (click)="cancelCategoryEdit()" title="Cancel">❌</button>
                          </ng-template>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" (click)="showListModal = false">Close</button>
            </div>
          </div>
        </div>
      </section>


      <!-- Special Rates Section -->
      <section class="management-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon">💰</span>
            Special Lunch Pricing
          </h2>
          <div class="button-group">
            <button class="btn btn-primary" (click)="showAddRateModal = true">
              <span>+</span>
              Add
            </button>
            <button class="btn btn-secondary" (click)="showRateListModal = true">
              <span>📋</span>
              View
            </button>
          </div>
        </div>

        <!-- Add Rate Modal -->
        <div class="modal" *ngIf="showAddRateModal" (click)="showAddRateModal = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">Add Special Rate</h3>
              <button class="close-button" (click)="showAddRateModal = false">×</button>
            </div>
            <form (ngSubmit)="addSpecialRate()" #rateForm="ngForm">
              <div class="modal-body">
                <div class="form-row">
                  <div class="form-group">
                    <label for="specialDate" class="form-label">Date</label>
                    <input
                      id="specialDate"
                      class="form-control"
                      type="date"
                      name="newSpecialDate"
                      [(ngModel)]="newSpecialDate"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="specialRate" class="form-label">Rate (₹)</label>
                    <input
                      id="specialRate"
                      class="form-control"
                      type="number"
                      name="newSpecialRate"
                      [(ngModel)]="newSpecialRate"
                      required
                      min="1"
                      placeholder="Enter rate amount"
                    />
                  </div>
                  <div class="form-group">
                    <label for="specialDescription" class="form-label">Description</label>
                    <input
                      id="specialDescription"
                      class="form-control"
                      type="text"
                      name="newSpecialDescription"
                      [(ngModel)]="newSpecialDescription"
                      placeholder="Enter the description (optional)"
                    />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" type="button" (click)="showAddRateModal = false">
                  Cancel
                </button>
                <button class="btn btn-primary" type="submit" [disabled]="!rateForm.valid">
                  Add Rate
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Special Rates List Modal -->
        <div class="modal" *ngIf="showRateListModal" (click)="showRateListModal = false">
          <div class="modal-content large-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">Special Rates</h3>
              <button class="close-button" (click)="showRateListModal = false">×</button>
            </div>
            <div class="modal-body">
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Rate</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let rate of specialRates; let i = index">
                      <td>{{ i + 1 }}</td>
                      <td>
                        <ng-container *ngIf="editSpecialRateId !== rate.id; else editDate">
                          <span class="date-text">{{ rate.date | date:'mediumDate' }}</span>
                        </ng-container>
                        <ng-template #editDate>
                          <input
                            type="date"
                            [(ngModel)]="editSpecialDate"
                            class="edit-input"
                          />
                        </ng-template>
                      </td>
                      <td>
                        <ng-container *ngIf="editSpecialRateId !== rate.id; else editRate">
                          <span class="rate-text">{{ rate.rate | currency:'INR':'symbol':'1.0-0' }}</span>
                        </ng-container>
                        <ng-template #editRate>
                          <input
                            type="number"
                            [(ngModel)]="editSpecialRate"
                            class="edit-input"
                            min="1"
                          />
                        </ng-template>
                      </td>
                      <td>
                      <ng-container *ngIf="editSpecialRateId !== rate.id; else editDesc">
                        {{ rate.description || '-' }}
                      </ng-container>
                      <ng-template #editDesc>
                        <input
                          type="text"
                          [(ngModel)]="editSpecialDescription"
                          class="edit-input"
                          placeholder="Enter description"
                        />
                      </ng-template>
                    </td>

                      <td>
                        <div class="action-buttons">
                          <ng-container *ngIf="editSpecialRateId !== rate.id; else editActions">
                            <button class="btn-icon edit" (click)="setEditRate(rate)" title="Edit">✏️</button>
                            <button class="btn-icon delete" (click)="deleteRate(rate.id)" title="Delete">🗑️</button>
                          </ng-container>
                          <ng-template #editActions>
                            <button class="btn-icon save" (click)="saveRateEdit()" title="Save">💾</button>
                            <button class="btn-icon cancel" (click)="editSpecialRateId = null" title="Cancel">❌</button>
                          </ng-template>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" (click)="showRateListModal = false">Close</button>
            </div>
          </div>
        </div>
      </section>
      </div>
  `, styles: [`
    /* Base Variables */


    /* === MODAL BACKDROP === */
.modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

/* === MODAL CONTAINER === */
.modal-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large-modal {
  max-width: 800px;
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

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
}

.close-button:hover {
  color: #1a202c;
}

/* === MODAL BODY & FOOTER === */
.modal-body {
  margin-bottom: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}

/* === FORM ELEMENTS === */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #4a5568;
  font-size: 0.875rem;
}

.form-control,
.edit-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  transition: 0.2s ease;
  background-color: #fff;
}

.form-control:focus,
.edit-input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

.form-control::placeholder {
  color: #a0aec0;
}

/* === ICON BUTTONS === */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s ease;
}

/* === TABLE STYLING === */
.table-container {
  overflow-x: auto;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f7fafc;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.data-table tr:hover {
  background-color: #f0f4f8;
}

/* === OTHER === */
.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-text {
  font-weight: 500;
  color: #2d3748;
}

.full-width {
      width: 100%;
}

/* === ANIMATIONS === */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

/* === RESPONSIVE === */
@media (max-width: 600px) {
  .modal-content {
    padding: 16px;
    margin: 16px;
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
  }

  .btn-icon {
    width: 32px;
    height: 32px;
  }
}


/* Base Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
.inventory-container {
  padding: var(--space-3);
  max-width: 100%;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 48px;
  padding: 32px 0;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: var(--border-radius-xl);
  color: var(--white);
  box-shadow: var(--shadow-lg);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1.1rem;
  font-weight: 400;
}

.management-section {
  background: white;
  padding: 8px 16px;                      
  transition: var(--transition);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-4);
}

.section-header {
  display: flex;
  align-items: center;   
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 16px;
  min-height: 64px; 
}


.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  font-size: 1.75rem;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px; /* medium rounded */
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
}



.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--white);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--secondary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background-color: transparent;
  color: var(--gray-600);
  border: 2px solid var(--gray-300);
}

.btn-outline:hover:not(:disabled) {
  background-color: var(--gray-50);
  border-color: var(--gray-400);
  transform: translateY(-1px);
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-size: 1rem;
  background-color: transparent;
}
  `]
})
export class MasterComponent implements OnInit {
  inventoryItemName: any[] = [];
  inventoryItemCategory: any[] = [];
  categories: any[] = [];
  units = Object.values(UnitType);
  showUploadModal = false;
  selectedFile: File | null = null;
  newInventoryItemName: string = '';
  newInventoryItemUnit: string = '';
  newInventoryItemCategory: any = null;
  newCategory: string = '';
  showAddItemModal = false;
  showItemListModal = false;
  showAddModal = false;
  showListModal = false;
  editItemId: number | null = null;
  editItemName: string = '';
  editMode: boolean = false;
  editCategoryId: number | null = null;
  editCategoryName: string = '';

  specialRates: { id: number; date: string; rate: number, description?: string }[] = [];
  newSpecialDate: string = '';
  newSpecialRate: number | null = null;
  newSpecialDescription: string = '';
  editSpecialRateId: number | null = null;
  editSpecialDate: string = '';
  editSpecialRate: number | null = null;
  editSpecialDescription: string = '';

  showAddRateModal: boolean = false;
  showRateListModal: boolean = false;
  editItemUnit: string = '';
  editItemCategory: any;
  newInventoryItemMinimumStock: any;
  editItemMinimumStock: any;

  constructor(private masterRecordService: MasterRecordService) { }

  ngOnInit(): void {
    this.loadInventoryItemName();
    this.loadCategories();
    this.loadSpecialRates();
  }

  loadInventoryItemName() {
    this.masterRecordService.getInventoryItemName().subscribe({
      next: (data) => {
        this.inventoryItemName = data;
      },
      error: (err) => console.error('Failed to fetch inventory items', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadSelectedFile(): void {
    if (!this.selectedFile) return;

    this.masterRecordService.uploadInventoryItemName(this.selectedFile).subscribe({
      next: () => {
        alert('Upload successful!');
        this.showUploadModal = false;
        this.selectedFile = null;
      },
      error: () => {
        alert('Upload failed.');
      }
    });
  }


  openAddModal() {
    this.clearForm();
    this.editMode = false;
    this.showAddItemModal = true;
  }

  closeAddModal() {
    this.clearForm();
    this.showAddItemModal = false;
  }

  closeViewModal() {
    this.showItemListModal = false;
    this.clearForm();
  }

  clearForm() {
    this.newInventoryItemName = '';
    this.newInventoryItemUnit = '';
    this.newInventoryItemCategory = null;
    this.newInventoryItemMinimumStock = null;
    this.editItemId = null;
    this.editMode = false;
  }


  addNewInventoryItemName() {
    if (
      !this.newInventoryItemName ||
      !this.newInventoryItemUnit ||
      !this.newInventoryItemCategory ||
      this.newInventoryItemMinimumStock == null
    ) return;

    const payload = {
      name: this.newInventoryItemName,
      unit: this.newInventoryItemUnit,
      category_id: this.newInventoryItemCategory.id,
      kitchen_location: '',
      minimum_stock: this.newInventoryItemMinimumStock
    };

    const request = this.editMode && this.editItemId
      ? this.masterRecordService.updateInventoryItem(this.editItemId, payload)
      : this.masterRecordService.addInventoryItem(payload);

    request.subscribe({
      next: () => {
        this.closeAddModal();
        this.loadInventoryItemName();
      },
      error: (err) => console.error('Failed to save item', err)
    });
  }

  setEditInventoryItem(item: any) {
    this.editMode = true;
    this.editItemId = item.id;
    this.newInventoryItemName = item.name;
    this.newInventoryItemUnit = item.unit || '';
    this.newInventoryItemCategory = this.categories.find(
      (cat) => cat.id === item.category?.id
    ) || null;
    this.newInventoryItemMinimumStock = item.minimum_stock;

    this.showItemListModal = false;
    this.showAddItemModal = true;
  }


  deleteInventoryItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.masterRecordService.deleteInventoryItem(id).subscribe({
        next: () => this.loadInventoryItemName(),
        error: (err) => console.error('Failed to delete item', err)
      });
    }
  }
  loadCategories() {
    this.masterRecordService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;

        // If editing, re-map the selected category to maintain reference
        if (this.editCategoryId !== null) {
          const match = this.categories.find(cat => cat.id === this.editCategoryId);
          if (match) this.editCategoryName = match.category;
        }
      },
      error: (err) => {
        console.error('Failed to fetch categories', err);
      }
    });
  }

  addNewCategory() {
    const trimmedCategory = this.newCategory.trim();
    if (!trimmedCategory) return;

    const alreadyExists = this.categories.some(
      (cat) => cat.category.toLowerCase() === trimmedCategory.toLowerCase()
    );

    if (alreadyExists) {
      alert('Category already exists!');
      return;
    }

    const categoryPayload = { category: trimmedCategory };

    this.masterRecordService.addCategory(categoryPayload).subscribe({
      next: () => {
        this.newCategory = '';
        this.showAddModal = false;
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to add category', err);
      }
    });
  }

  setEditCategory(category: { id: number; category: string }) {
    this.editMode = true;
    this.editCategoryId = category.id;

    // Optional: If you want to ensure match from categories list
    const matchedCategory = this.categories.find(cat => cat.id === category.id);
    this.editCategoryName = matchedCategory?.category || category.category;

    this.showAddModal = true; // Show modal for editing
  }

  saveCategoryEdit() {
    if (this.editCategoryId !== null && this.editCategoryName.trim()) {
      const payload = { category: this.editCategoryName.trim() };

      this.masterRecordService.updateCategory(this.editCategoryId, payload).subscribe({
        next: () => {
          this.editMode = false;
          this.editCategoryId = null;
          this.editCategoryName = '';
          this.showAddModal = false;
          this.loadCategories();
        },
        error: (err) => {
          console.error('Failed to update category', err);
        }
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.masterRecordService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Failed to delete category', err)
      });
    }
  }
  cancelCategoryEdit() {
    this.editMode = false;
    this.editCategoryId = null;
    this.editCategoryName = '';
  }


  loadSpecialRates() {
    this.masterRecordService.getSpecialLunchRate().subscribe({
      next: (data) => this.specialRates = data,
      error: (err) => console.error('Failed to fetch special lunch rates', err)
    });
  }

  addSpecialRate() {
    const trimmedDate = this.newSpecialDate.trim();
    if (!trimmedDate || this.newSpecialRate == null) return;

    const duplicate = this.specialRates.some(rate => rate.date === trimmedDate);
    if (duplicate) {
      alert('Rate already exists for this date.');
      return;
    }

    this.masterRecordService.addSpecialLunchRate({ date: trimmedDate, rate: this.newSpecialRate, description: this.newSpecialDescription }).subscribe({
      next: () => {
        this.newSpecialDate = '';
        this.newSpecialRate = null;
        this.showAddRateModal = false;
        this.loadSpecialRates();
      },
      error: (err) => console.error('Failed to add rate', err)
    });
  }

  setEditRate(rate: { id: number; date: string; rate: number; description?: string }) {
    this.editSpecialRateId = rate.id;
    this.editSpecialDate = rate.date;
    this.editSpecialRate = rate.rate;
    this.editSpecialDescription = rate.description || '';
  }


  saveRateEdit() {
    if (!this.editSpecialRateId || !this.editSpecialDate.trim() || this.editSpecialRate == null) return;

    this.masterRecordService.updateSpecialLunchRate(this.editSpecialRateId, {
      date: this.editSpecialDate,
      rate: this.editSpecialRate,
      description: this.editSpecialDescription
    }).subscribe({
      next: () => {
        this.editSpecialRateId = null;
        this.editSpecialDate = '';
        this.editSpecialRate = null;
        this.editSpecialDescription = '';
        this.loadSpecialRates();
      },
      error: (err) => console.error('Failed to update rate', err)
    });
  }

  deleteRate(id: number) {
    if (!confirm('Delete this rate?')) return;
    this.masterRecordService.deleteSpecialLunchRate(id).subscribe({
      next: () => this.loadSpecialRates(),
      error: (err) => console.error('Failed to delete rate', err)
    });
  }
}