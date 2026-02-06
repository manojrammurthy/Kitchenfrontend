import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItemService } from '../../services/food.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RecipesComponent } from '../recipes/recipes.component';
import { MatDialog } from '@angular/material/dialog';
import { RecipesIngridientComponent } from '../recipe-ingridients/recipe-ingridients';
import { RecipeService } from '../../services/recipe.service';
import { LocationService } from '../../services/location.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-food-items',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule, MatTableModule, RecipesComponent, RecipesIngridientComponent],
  template: `
      <div class="food-items-container">
        <div class="page-header">
          <h2>Food Item</h2>
            <!-- Right-Aligned Action Buttons -->
            <div class="action-buttons">
              <button class="btn-primary" (click)="openFoodForm()">Add Food Item</button>
              <button class="btn " (click)="showUploadModal = true">
                <span>📤</span> Upload Food Item
              </button>
              <button class="btn" (click)="showRecipeUploadModal = true">
                <span>📤</span> Upload Recipe
              </button>
              <button class="btn" (click)="showRecipeIngridientUploadModal = true">
                <span>📤</span> Upload Recipe Ingridients
              </button>
            </div>
        </div>
        
        <!-- FOOD ITEM UPLOAD -->
        <div class="modal" *ngIf="showUploadModal" (click)="showUploadModal = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="modal-header">
              <h3 class="modal-title">Upload food item (CSV/Excel)</h3>
              <button class="close-btn" (click)="showUploadModal = false">✖</button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
              <input
                type="file"
                (change)="onFileSelected($event)"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="showUploadModal = false">Cancel</button>
              <button class="btn btn-primary" (click)="uploadSelectedFile()" [disabled]="!selectedFile">Upload</button>
            </div>
          </div>
        </div>

        <!-- RECIPE UPLOAD -->
        <div class="modal" *ngIf="showRecipeUploadModal" (click)="showRecipeUploadModal = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">Upload recipe (CSV/Excel)</h3>
              <button class="close-btn" (click)="showRecipeUploadModal = false">✖</button>
            </div>

            <div class="modal-body">
              <input
                type="file"
                (change)="onRecipeFileSelected($event)"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="showRecipeUploadModal = false">Cancel</button>
              <button class="btn btn-primary" (click)="uploadRecipeFile()" [disabled]="!selectedRecipeFile">Upload</button>
            </div>
          </div>
        </div>


        <!-- RECIPE INGRIDIENTS UPLOAD -->
        <div class="modal" *ngIf="showRecipeIngridientUploadModal" (click)="showRecipeIngridientUploadModal = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">Upload recipe ingridients (CSV/Excel)</h3>
              <button class="close-btn" (click)="showRecipeIngridientUploadModal = false">✖</button>
            </div>

            <div class="modal-body">
              <input
                type="file"
                (change)="onRecipeIngridientFileSelected($event)"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="showRecipeIngridientUploadModal = false">Cancel</button>
              <button class="btn btn-primary" (click)="uploadRecipeIngridientFile()" [disabled]="!showRecipeIngridientFile">Upload</button>
            </div>
          </div>
        </div>

      <div class="food-grid">
        <div class="food-card" *ngFor="let item of data">
          <!-- Card Header -->
          <div class="card-header">
            <div class="food-info">
              <h3 class="food-name">{{ item.name }}</h3>
              <span class="badge badge-{{ item.meal_types }}">{{ item.meal_types }}</span>
            </div>
          </div>

          <!-- Food Details -->
          <div class="food-details">
            <div class="detail-item">
              <span class="icon">🍽️</span>
              <div class="detail-content">
                <span class="detail-label">Preparation</span>
                <span class="detail-value">{{ item.preparation_type | titlecase }}</span>
              </div>
            </div>
          </div>

          <!-- Card Actions - Restructured for better UX -->
          <div class="card-actions">
            <!-- Primary Actions -->
            <div class="primary-actions">
              <button class="btn-primary" (click)="editFoodItem(item)" title="Edit item">
                <span class="btn-icon">✏️</span>
                <span class="btn-text">Edit</span>
              </button>
              <button class="btn-danger" (click)="deleteFoodItem(item.id)" title="Delete item">
                <span class="btn-icon">🗑️</span>
                <span class="btn-text">Delete</span>
              </button>
            </div>

            <!-- Secondary Actions -->
            <div class="secondary-actions">
              <div class="action-group">
                <span class="group-label">Food Management</span>
                <div class="action-buttons">
                  <button class="btn-secondary" (click)="openRecipeModal(item.id)" title="Add Recipe">
                    <span class="btn-icon">📖</span>
                    <span class="btn-text">Recipe</span>
                  </button>
                  <button class="btn-secondary" (click)="openIngredientModal(item.id)" title="Add/Edit Ingredients">
                    <span class="btn-icon">🥣</span>
                    <span class="btn-text">Ingredients</span>
                  </button>
                  <button class="btn-secondary" (click)="openAvailabilityModal(item.id)" title="Check Stock Availability">
                    <span class="btn-icon">🧾</span>
                    <span class="btn-text">Stock</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- Add Food Item Modal -->
        <div class="modal" *ngIf="showFoodForm" (click)="closeFoodForm()">
          <div class="modal-content slide-in-up" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Add New Food Item</h3>
              <button class="btn-close" (click)="closeFoodForm()">×</button>
            </div>

            <div class="modal-body form-container">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Food Name</mat-label>
                <input matInput placeholder="Enter food name" [(ngModel)]="newItem.name" name="name" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Meal Type</mat-label>
                <mat-select [(ngModel)]="newItem.meal_types" name="meal" required>
                  <mat-option *ngFor="let meal of mealChoices" [value]="meal.key">
                    {{ meal.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Preparation Type</mat-label>
                <mat-select [(ngModel)]="newItem.preparation_type" name="prep" required>
                  <mat-option *ngFor="let prep of prepChoices" [value]="prep.key">
                    {{ prep.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="modal-footer">
              <button mat-button (click)="closeFoodForm()">Cancel</button>
              <button mat-flat-button class="btn-primary" (click)="submitFoodItem()">Add Food Item</button>
            </div>
          </div>
        </div>

        <!-- Stock Availability Modal -->
        <div class="stock-availability-overlay" *ngIf="showAvailabilityModal" (click)="closeAvailabilityModal()">
          <div class="stock-availability-container" (click)="$event.stopPropagation()">
            <h2 class="stock-availability-header">Stock Required</h2>

            <!-- Stock Check Form -->
            <form [formGroup]="availabilityForm" (ngSubmit)="submitAvailability()" class="stock-availability-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Kitchen Location</mat-label>
                <mat-select formControlName="kitchen_location" required>
                  <mat-option *ngFor="let loc of kitchenLocations" [value]="loc.id">
                    {{ loc.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>No. of Serves</mat-label>
                <input matInput type="number" min="1" formControlName="no_of_serves" required>
              </mat-form-field>

              <div class="stock-availability-actions mt-2">
                <button mat-raised-button color="primary" type="submit">Check</button>
                <button mat-button type="button" (click)="closeAvailabilityModal()">Cancel</button>
              </div>
            </form>

            <!-- Availability Result Table -->
            <div *ngIf="availabilityResult" class="availability-result mt-4">
              <div *ngFor="let item of availabilityResult | keyvalue">
                <h3 class="food-item-title">{{ item.key }}</h3>

                <table mat-table [dataSource]="item.value" class="mat-elevation-z2 full-width">

                  <!-- Ingredient -->
                  <ng-container matColumnDef="ingredient">
                    <th mat-header-cell *matHeaderCellDef> Ingredient </th>
                    <td mat-cell *matCellDef="let element"> {{ element.ingredient }} </td>
                  </ng-container>

                  <!-- Required -->
                  <ng-container matColumnDef="required">
                    <th mat-header-cell *matHeaderCellDef> Required </th>
                    <td mat-cell *matCellDef="let element"> {{ element.required }} </td>
                  </ng-container>

                  <!-- Available -->
                  <ng-container matColumnDef="available">
                    <th mat-header-cell *matHeaderCellDef> Available </th>
                    <td mat-cell *matCellDef="let element"> {{ element.available }} </td>
                  </ng-container>

                  <!-- Status -->
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Status </th>
                    <td mat-cell *matCellDef="let element">
                      <span [ngClass]="{
                        'text-success': element.status === 'Sufficient',
                        'text-danger': element.status === 'Insufficient'
                      }">{{ element.status }}</span>
                    </td>
                  </ng-container>

                  <!-- Rows -->
                  <tr mat-header-row *matHeaderRowDef="availabilityDisplayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: availabilityDisplayedColumns;"></tr>
                </table>
              </div>
            </div>
          </div>
        </div>
          <app-recipes
            *ngIf="showRecipeModal"
            [foodItemId]="selectedFoodItemId">
          </app-recipes>
        <app-recipes-ingridient
          *ngIf="selectedFoodItemIdForIngredients && showRecipeIngredientForm"
          [foodItemId]="selectedFoodItemIdForIngredients"
          (close)="closeIngredientForm()">
        </app-recipes-ingridient>
      </div>
    `,
  styles: [`
      .food-items-container {
        padding: var(--space-3);
        max-width: 100%;
        margin: 0 auto;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-3);
      }

      .action-buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      .upload-section {
        margin-bottom: 16px;
      }

      .upload-label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
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

      .food-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 16px;
    }

    .food-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      transition: all 0.3s ease;
    }

    .food-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    /* Card Header */
    .card-header {
      margin-bottom: 16px;
    }

    .food-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .food-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .badge-breakfast { background: #fef3c7; color: #92400e; }
    .badge-lunch { background: #dbeafe; color: #1e40af; }
    .badge-dinner { background: #e0e7ff; color: #5b21b6; }
    .badge-snack { background: #d1fae5; color: #065f46; }

    /* Food Details */
    .food-details {
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .icon {
      font-size: 1.2rem;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
    }

    .detail-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .detail-value {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 600;
    }

    .primary-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .secondary-actions {
      margin-top: 12px;
    }

    .action-group {
      background: #f9fafb;
      border-radius: 8px;
      padding: 12px;
    }

    .group-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-danger, .btn-secondary {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      color: white;
      flex: 1;
    }
    
    .btn-text {
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .full-width {
      width: 100%;
    }
  
    .btn-danger {
      color: black;
      flex: 1;
    }

    .btn-danger:hover {
      background: #dc2626;
      transform: translateY(-1px);
      color: white;
    }

    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
      flex: 1;
      min-width: 0;
    }

    .btn-secondary:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
      transform: translateY(-1px);
    }

    .btn-icon {
      font-size: 1rem;
    }

    .btn-text {
      font-weight: 500;
    }
        /* Overlay */
    .stock-availability-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Modal Container */
    .stock-availability-container {
      background: #fff;
      padding: 24px;
      width: 90%;
      max-width: 500px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      position: relative;
    }

    /* Header */
    .stock-availability-header {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 22px;
      font-weight: 600;
      text-align: center;
      color: #333;
    }

    /* Form Styling */
    .stock-availability-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Actions (Buttons) */
    .stock-availability-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    /* Full Width Utility */
    .full-width {
      width: 100%;
    }

    .availability-result {
  margin-top: 24px;
}

.food-item-title {
  font-size: 18px;
  font-weight: 500;
  margin: 16px 0 8px;
  color: #3f51b5;
}

.text-success {
  color: green;
  font-weight: 500;
}

.text-danger {
  color: red;
  font-weight: 500;
}

    /* Optional: Add some transitions */
    .stock-availability-container,
    .stock-availability-overlay {
      transition: all 0.3s ease-in-out;
    }


    `]
})
export class FoodItemsComponent implements OnInit {
  @ViewChild('recipeComp') recipeComponent!: RecipesComponent;

  data: any[] = [];
  newItem: any = {};
  showFoodForm = false;
  prepChoices: { key: string; label: string }[] = [];
  mealChoices: { key: string; label: string }[] = [];

  showUploadModal = false;
  showRecipeUploadModal = false;
  showRecipeIngridientUploadModal = false;
  selectedFile: File | null = null;
  selectedRecipeFile: File | null = null;
  showRecipeIngridientFile: File | null = null;

  isEditMode = false;
  showRecipeIngridientModal: boolean = false;

  availabilityForm!: FormGroup;
  showAvailabilityModal = false;
  kitchenLocations: any[] = [];
  selectedAvailabilityFoodItemId: number | null = null;

  availabilityResult: { [foodItemName: string]: any[] } | null = null;
  availabilityDisplayedColumns: string[] = ['ingredient', 'required', 'available', 'status'];


  constructor(
    private fb: FormBuilder,
    private foodItemService: FoodItemService,
    private recipeService: RecipeService,
    private locationService: LocationService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadFoodItems();
    this.loadPreparationChoices();
    this.loadMealChoices();

    this.availabilityForm = this.fb.group({
      kitchen_location: ['', Validators.required],
      no_of_serves: [1, [Validators.required, Validators.min(1)]]
    });


    this.locationService.getKitchenLocations().subscribe({
      next: (data) => this.kitchenLocations = data,
      error: (err) => console.error('Kitchen location fetch error:', err)
    });
  }

  loadPreparationChoices(): void {
    this.foodItemService.getPreparationChoices().subscribe({
      next: (data) => this.prepChoices = data,
      error: (err) => console.error('Error loading preparation choices', err)
    });
  }

  loadMealChoices(): void {
    this.foodItemService.getMealChoices().subscribe({
      next: (data) => this.mealChoices = data,
      error: (err) => console.error('Error loading meal choices', err)
    });
  }

  openFoodForm() {
    this.newItem = {};
    this.showFoodForm = true;
  }

  editFoodItem(item: any): void {
    this.isEditMode = true;
    this.newItem = {
      id: item.id,
      name: item.name,
      meal_types: item.meal_types,
      preparation_type: item.preparation_type
    };
    this.showFoodForm = true;
  }

  closeFoodForm(): void {
    this.showFoodForm = false;
    this.newItem = {};
    this.isEditMode = false;
  }

  deleteFoodItem(id: number): void {
    if (confirm('Are you sure you want to delete this food item?')) {
      this.foodItemService.deleteFoodItem(id).subscribe({
        next: () => {
          alert('Food item deleted successfully');
          this.loadFoodItems(); // refresh the list
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete food item');
        }
      });
    }
  }

  loadFoodItems() {
    this.foodItemService.getFoodItems().subscribe(
      res => this.data = res,
      err => console.error('Error loading food items:', err)
    );
  }

  submitFoodItem() {
    const payload = { ...this.newItem };

    if (!payload.name || !payload.meal_types || !payload.preparation_type) {
      alert('Please fill in all required fields.');
      return;
    }

    if (this.isEditMode && payload.id) {
      this.foodItemService.updateFoodItem(payload).subscribe({
        next: (res) => {
          this.loadFoodItems();
          this.closeFoodForm();
        },
        error: (err) => console.error('Update error:', err)
      });
    } else {
      this.foodItemService.addFoodItem(payload).subscribe({
        next: (res) => {
          this.loadFoodItems();
          this.closeFoodForm();
        },
        error: (err) => console.error('Add error:', err)
      });
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onRecipeFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedRecipeFile = input.files[0];
    }
  }

  onRecipeIngridientFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.showRecipeIngridientFile = input.files[0];
    }
  }

  uploadSelectedFile(): void {
    if (!this.selectedFile) return;

    this.foodItemService.uploadFoodMenu(this.selectedFile).subscribe({
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

  uploadRecipeFile(): void {
    if (!this.selectedRecipeFile) return;

    this.recipeService.uploadRecipeFile(this.selectedRecipeFile).subscribe({
      next: () => {
        alert('Recipe uploaded successful!');
        this.showRecipeUploadModal = false;
        this.selectedRecipeFile = null;
      },
      error: () => {
        alert('Upload failed.');
      }
    });
  }
  uploadRecipeIngridientFile(): void {
    if (!this.showRecipeIngridientFile) return;

    this.recipeService.uploadRecipeIngridient(this.showRecipeIngridientFile).subscribe({
      next: () => {
        alert('Recipe ingridients uploaded successful!');
        this.showRecipeIngridientUploadModal = false;
        this.showRecipeIngridientFile = null;
      },
      error: () => {
        alert('Upload failed.');
      }
    });
  }


  showRecipeModal = false;
  selectedFoodItemId: number | null = null;

  openRecipeModal(id: number) {
    if (this.selectedFoodItemId === id) {
      this.selectedFoodItemId = null; // force reset first
      setTimeout(() => {
        this.selectedFoodItemId = id;
        this.showRecipeModal = true;
      }, 0);
    } else {
      this.selectedFoodItemId = id;
      this.showRecipeModal = true;
    }
  }


  closeRecipeModal() {
    this.showRecipeModal = false;
    this.selectedFoodItemId = null;
  }

  showRecipeIngredientForm: boolean = false;
  selectedFoodItemIdForIngredients: number | null = null;

  openIngredientModal(id: number): void {
    if (this.selectedFoodItemIdForIngredients === id && this.showRecipeIngredientForm) {
      this.showRecipeIngredientForm = false;
      setTimeout(() => {
        this.selectedFoodItemIdForIngredients = id;
        this.showRecipeIngredientForm = true;
      }, 0);
    } else {
      this.selectedFoodItemIdForIngredients = id;
      this.showRecipeIngredientForm = true;
    }
  }

  closeIngredientForm(): void {
    this.showRecipeIngredientForm = false;
    this.selectedFoodItemIdForIngredients = null;
  }


  openAvailabilityModal(foodItemId: number): void {
    this.selectedAvailabilityFoodItemId = foodItemId;
    this.availabilityForm.reset({ kitchen_location: '', no_of_serves: 1 });
    this.showAvailabilityModal = true;
  }

  closeAvailabilityModal(): void {
    this.showAvailabilityModal = false;
    this.selectedAvailabilityFoodItemId = null;
    this.availabilityResult = null; // Reset on close
  }


  submitAvailability(): void {
    if (this.availabilityForm.invalid || this.selectedAvailabilityFoodItemId === null) return;

    const { kitchen_location, no_of_serves } = this.availabilityForm.value;
    console.log('Sending availability check for:', {
      food_item_id: this.selectedAvailabilityFoodItemId,
      kitchen_location,
      no_of_serves
    });

    this.recipeService
      .calculateStockAvailability(this.selectedAvailabilityFoodItemId, kitchen_location, no_of_serves)
      .subscribe({
        next: (result) => {
          this.availabilityResult = result;
        },
        error: (err) => {
          console.error('Availability check failed:', err);
          alert('Failed to check stock availability');
        }
      });
  }


}