import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { ExcelService } from '../../services/excel.service';
import { InventoryItem, UnitType, Category, MonthType } from '../../models/inventory-item.model';
import { MasterRecordService } from '../../services/master.record.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inventory-container fade-in">
      <!-- <div class="page-header">
        <h2 class="page-title">Kitchen Inventory</h2>
        <button class="btn-primary" (click)="openAddItemForm()">Add New Item</button>
      </div> -->      
      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search inventory..." 
            [(ngModel)]="searchTerm"
            (input)="applyFilters()">
        </div>
        <!-- <div class="form-group">
          <select class="form-control" [(ngModel)]="yearFilter" (change)="applyFilters()">
            <option value="">All Years</option>
            <option *ngFor="let year of years" [value]="year">
              {{ year }}
            </option>
          </select>
        </div> -->
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

          <!-- <select class="form-control" [(ngModel)]="monthFilter" (change)="applyFilters()">
            <option value="">All Months</option>
            <option *ngFor="let month of months" [value]="month.value">
              {{ month.label }}
            </option>
          </select> -->
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredItems">
              <td>{{ item.name.name }}</td>
              <td>
                <span class="badge badge-primary">{{ item.name?.category?.category }}</span>
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
              <td class="actions-cell">
              <div class="actions-wrapper">
                <!-- <button class="btn-icon" (click)="editItem(item)">✏️</button> -->
                <!-- <button class="btn-icon" (click)="updateStock(item)">🔄</button> -->
                <button class="btn-icon" (click)="deleteItem(item)">🗑️</button>
                <button class="btn-icon" (click)="toggleItemStatus(item)">
                  {{ item.is_active ? '🟢' : '🔴' }}
                </button>
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
          <form (ngSubmit)="saveItem()">
            <div class="form-group">
              <label>Name</label>
              <input type="text" placeholder="Enter ingridient name" [(ngModel)]="currentItem.name" name="name" required>
            </div>

            <div class="form-group">
            <label>Category</label>
            <select [(ngModel)]="currentItem.category" name="category" required>
              <option value="" disabled selected hidden>Select a category</option>
              <option *ngFor="let category of categories" [value]="category.category">
                {{ category.category }}
              </option>            
            </select>
          </div>
            <div class="form-group">
              <label>Quantity</label>
              <input type="number" placeholder="Enter quantity" [(ngModel)]="currentItem.quantity" name="quantity" min="0" step="0.01">
            </div>
            <div class="form-group">
              <label>Unit</label>
              <select [(ngModel)]="currentItem.unit" name="unit" required>
                <option value="" disabled selected hidden>Select a unit</option>
                <option *ngFor="let unit of units" [value]="unit">{{ unit }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Purchase Date</label>
              <input type="date" [(ngModel)]="currentItem.purchase_date" name="purchaseDate">
            </div>
            <div class="form-group">
              <label>Expiry Date</label>
              <input type="date" [(ngModel)]="currentItem.expiry_date" name="expiryDate">
            </div>
            <div class="form-group">
              <label>Price Before Tax</label>
              <input type="number" placeholder="Enter price" [(ngModel)]="currentItem.price_before_tax" name="priceBeforeTax" min="0" step="0.01" (input)="calculateTotalPrice()">
            </div>

            <div class="form-group">
              <label>Tax Percentage (%)</label>
              <input type="number" [(ngModel)]="currentItem.tax_percentage" name="taxPercentage" min="0" max="100" step="0.01" (input)="calculateTotalPrice()">
            </div>

            <div class="form-group">
              <label>Tax Amount</label>
              <input type="number" [(ngModel)]="currentItem.tax_amount" name="taxAmount" readonly>
            </div>

            <div class="form-group">
              <label>Total Price</label>
              <input type="number" [(ngModel)]="currentItem.purchase_price" name="purchasePrice" readonly>
            </div>

            <div class="form-group">
              <label>Current Stock</label>
              <input type="number" placeholder="Enter current stock" [(ngModel)]="currentItem.current_stock" name="currentStock" min="0" step="0.01">
            </div>

            <div class="form-group">
              <label>Minimum Stock</label>
              <input type="number" placeholder="Enter minimum stock" [(ngModel)]="currentItem.minimum_stock" name="minimumStock" min="0" step="0.01">
            </div>

            <div class="form-group">
              <label>Notes</label>
              <textarea placeholder="Enter notes" [(ngModel)]="currentItem.notes" name="notes"></textarea>
            </div>

            <div class="form-group horizontal">
              <label for="isActive">Active</label>
              <input id="isActive" type="checkbox" [(ngModel)]="currentItem.is_active" name="isActive">
            </div>


            <div class="form-group">
              <button class="btn-primary" type="submit">Save</button>
              <button type="button" (click)="closeItemForm()">Cancel</button>
            </div>
          </form>
        </div>
      </div>


      <!-- Stock Update Modal -->
      <div *ngIf="showStockUpdateForm" class="modal" (click)="closeStockUpdateForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button
            class="close-button"
            type="button"
            (click)="closeStockUpdateForm()"
          >×</button>
          <h3>Update Stock for {{ currentItem.name }}</h3>
          <form (ngSubmit)="saveStockUpdate()">
            <div class="form-group">
              <label>New Stock Level</label>
              <input
                type="number"
                [(ngModel)]="newStockLevel"
                name="newStockLevel"
                min="0"
                step="0.01"
              />
            </div>
            <div class="form-group">
              <label>Reason</label>
              <select [(ngModel)]="stockUpdateReason" name="stockUpdateReason">
                <option value="New Purchase">New Purchase</option>
                <option value="Consumption">Consumption</option>
                <option value="Wastage">Wastage</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group" *ngIf="stockUpdateReason === 'Other'">
              <label>Other Reason</label>
              <input
                type="text"
                [(ngModel)]="otherReason"
                name="otherReason"
              />
            </div>
            <div class="form-group last-of-type">
              <button class="btn-primary " type="submit">Update</button>
              <button type="button" (click)="closeStockUpdateForm()">Cancel</button>
            </div>
          </form>
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
    
    .filters {
      display: flex;
      gap: var(--space-2);
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
  `]
})

export class InventoryComponent implements OnInit {
  inventoryItems: any[] = [];
  filteredItems: any[] = [];
  categories: Category[] = [];

  // Filter variables
  searchTerm = '';
  categoryFilter = '';
  stockFilter = '';

  // Form variables
  showItemForm = false;
  isEditing = false;
  currentItem: Partial<InventoryItem> = {};

  // Stock update variables
  showStockUpdateForm = false;
  newStockLevel = 0;
  stockUpdateReason = 'New Purchase';
  otherReason = '';

  // Dropdown options
  units = Object.values(UnitType);
  months = Object.values(MonthType);
  years: string[] = [];

  constructor(
    private inventoryService: InventoryService,
    private excelService: ExcelService,
    private masterRecordService: MasterRecordService,
  ) { }

  ngOnInit(): void {
    this.loadLastFourMonthsData();
    this.loadCategories();
  }

  loadLastFourMonthsData(): void {
    this.inventoryService.getInventoryItems().subscribe(items => {
      const today = new Date();
      const fourMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);

      this.inventoryItems = items.filter(item => {
        const purchaseDate = new Date(item.purchase_date);
        return purchaseDate >= fourMonthsAgo && purchaseDate <= today;
      });

      this.applyFilters();
    });
  }

  loadCategories(): void {
    this.masterRecordService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to fetch categories', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.inventoryItems];

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.name.toLowerCase().includes(search) ||
        item.name?.category?.category.toLowerCase().includes(search) ||
        (item.notes && item.notes.toLowerCase().includes(search))
      );
    }

    if (this.categoryFilter) {
      filtered = filtered.filter(item => item.name?.category?.category === this.categoryFilter);
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

  openAddItemForm(): void {
    this.isEditing = false;
    this.showStockUpdateForm = false;

    this.currentItem = {
      id: 0,
      name: {
        id: 0,
        name: '',
        unit: '',
        minimum_stock: 0,
        is_active: true,
        category: {
          id: 0,
          category: '',
          is_active: true
        }
      },
      category: {
        id: 0,
        category: '',
        is_active: true
      },
      kitchen_location: {
        id: 0,
        name: ''
      },
      quantity: 0,
      unit: '',
      purchase_date: new Date(),
      expiry_date: new Date(),
      created_at: new Date(),
      last_updated: new Date(),
      purchase_price: 0,
      price_before_tax: 0,
      tax_amount: 0,
      tax_percentage: 18,
      current_stock: 0,
      minimum_stock: 0,
      notes: '',
      is_active: true
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
    if (!this.currentItem.name || !this.currentItem.category) {
      alert('Please fill in all required fields');
      return;
    }

    const sanitizedItem: InventoryItem = {
      ...(this.currentItem as InventoryItem),
      quantity: this.currentItem.quantity ?? 0,
      price_before_tax: this.currentItem.price_before_tax ?? 0,
      tax_percentage: this.currentItem.tax_percentage ?? 0,
      tax_amount: this.currentItem.tax_amount ?? 0,
      purchase_price: this.currentItem.purchase_price ?? 0,
      current_stock: this.currentItem.current_stock ?? 0,
      minimum_stock: this.currentItem.minimum_stock ?? 0,
    };

    if (this.isEditing && this.currentItem.id) {
      this.inventoryService.updateInventoryItem(sanitizedItem.id, sanitizedItem).subscribe(() => {
        this.loadLastFourMonthsData();
        this.closeItemForm();
      });
    } else {
      const { id, ...itemWithoutId } = sanitizedItem;
      this.inventoryService.addInventoryItem(itemWithoutId).subscribe(() => {
        this.loadLastFourMonthsData();
        this.closeItemForm();
      });
    }
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
        ...this.currentItem as InventoryItem,
        current_stock: this.newStockLevel,
        last_updated: new Date(),
        notes: `${this.currentItem.notes || ''}\nStock updated from ${this.currentItem.current_stock} to ${this.newStockLevel} - Reason: ${reason} (${new Date().toLocaleString()})`.trim()
      };

      this.inventoryService.updateInventoryItem(updatedItem.id, updatedItem).subscribe(() => {
        this.loadLastFourMonthsData();
        this.closeStockUpdateForm();
      });
    }
  }

  toggleItemStatus(item: InventoryItem): void {
    const updatedItem: InventoryItem = {
      ...item,
      is_active: !item.is_active
    };

    this.inventoryService.updateInventoryItem(updatedItem.id, updatedItem).subscribe(() => {
      this.loadLastFourMonthsData();
    });
  }

  deleteItem(item: InventoryItem): void {
    const confirmed = confirm(`Are you sure you want to delete "${item.name}"?`);
    if (confirmed && item.id) {
      this.inventoryService.deleteInventoryItem(item.id).subscribe(() => {
        this.loadLastFourMonthsData();
      });
    }
  }

  exportToExcel(): void {
    const data = this.filteredItems.map(item => ({
      'Item Name': item.name,
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
}