import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MasterRecordService } from '../../services/master.record.service';
import { FoodItemService } from '../../services/food.service';

@Component({
    selector: 'app-recipes-ingridient',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatSlideToggleModule],
    template: `
    <div class="modal" *ngIf="showIngredientForm" (click)="closeIngredientForm()">
        <div class="modal-content slide-in-up" (click)="$event.stopPropagation()">
            <div class="modal-header">
            <h3>Manage Ingredients</h3>
            <div class="food-info">
                    <h4>{{ foodItemName }}</h4>
                    <h5>Servings : 10</h5>
            </div>
            <br>
            <button class="btn-close" (click)="closeIngredientForm()">×</button>
            </div>

            <!-- List of Existing Ingredients -->
            <div *ngIf="recipeIngredients.length > 0" class="ingredient-list">
                <h4>Existing Ingredients</h4>
                    <table class="ingredient-table full-width">
                        <thead>
                            <tr>
                                <th>Inventory Item</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let ing of recipeIngredients">
                                <td>{{ ing.inventory_item.name }}</td>
                                <td>{{ ing.quantity }}</td>
                                <td>{{ ing.inventory_item.unit }}</td>
                                <td>
                                <div class="action-buttons">
                                    <button mat-icon-button color="primary" (click)="editIngredient(ing)" title="Edit">
                                    ✏️
                                    </button>
                                    <button mat-icon-button color="warn" (click)="deleteIngredient(ing.id)" title="Delete">
                                    🗑️
                                    </button>
                                </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            <!-- Ingredient Add/Edit Form -->
            <form [formGroup]="ingredientForm" class="modal-body form-container" (ngSubmit)="submitIngredient()">
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Inventory Item</mat-label>
                    <mat-select formControlName="inventory_item_id" required>
                    <mat-option *ngFor="let item of ingridients" [value]="item.id">
                        {{ item.name }}
                    </mat-option>
                    </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Quantity</mat-label>
                    <input matInput type="number" formControlName="quantity" min="0.01" step="0.01" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width" *ngIf="ingredientForm.get('unit')?.value">
                    <mat-label>Unit</mat-label>
                    <input matInput formControlName="unit" readonly />
                </mat-form-field>

                <div class="modal-footer">
                    <button mat-button type="button" (click)="closeIngredientForm()">Cancel</button>
                    <button mat-flat-button color="primary" type="submit" [disabled]="ingredientForm.invalid">
                    {{ ingredientForm.get('inventory_item_id')?.value ? 'Update' : 'Add' }} Ingredient
                    </button>
                </div>
            </form>
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
      
    .full-width {
      width: 100%;
    }

    .btn-close {
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

    .btn-close:hover {
      color: #000;
    }

    .food-info {
        background-color: rgba(0, 0, 0, 0.04);
        border: 1px solid #d3e0ea;
        border-radius: 8px;
        padding: 15px 20px;
        text-align: center;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 15px;
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
    
    .form-container {
      padding: var(--space-3);
      max-width: 100%;
      margin: 0 auto;
    }
    .ingredient-table {
    width: 100%;
    border-collapse: collapse;
    background: transparent;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    margin: 16px 0;
    font-family: 'Inter', sans-serif;
    border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .ingredient-table thead {
    background: rgba(0, 0, 0, 0.04);
    backdrop-filter: blur(10px);
    }

    .ingredient-table thead th {
    padding: 20px 24px;
    text-align: left;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    border: none;
    position: relative;
    }

    .ingredient-table thead th::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 24px;
    right: 24px;
    height: 2px;
    background: rgba(0, 0, 0, 0.1);
    }

    .ingredient-table tbody tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    }

    .ingredient-table tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 1;
    }

    .ingredient-table tbody tr:last-child {
    border-bottom: none;
    }

    .ingredient-table tbody td {
    padding: 20px 24px;
    font-size: 15px;
    border: none;
    vertical-align: middle;
    line-height: 1.5;
    }

    .ingredient-table tbody td:first-child {
    font-weight: 600;
    font-size: 15px;
    }

    .ingredient-table tbody td:nth-child(2) {
    font-weight: 400;
    font-size: 15px;
    }

    .ingredient-table tbody td:nth-child(3) {
    font-weight: 400;
    font-size: 15px;
    }

    /* Action buttons styling */
    .ingredient-table .action-buttons {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: flex-end;
    }

    .ingredient-table tbody td:last-child {
    white-space: nowrap;
    }

    .ingredient-table button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 40px;
    background: rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
    }

    .ingredient-table button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
    }

    .ingredient-table button:hover::before {
    width: 100%;
    height: 100%;
    }

    .ingredient-table button:hover {
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.08);
    }

    /* Modal and ingredient list styling */
    .ingredient-list {
    margin-bottom: 32px;
    padding: 0 24px;
    }

    .ingredient-list h4 {
    font-weight: 700;
    margin-bottom: 20px;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    }

    .ingredient-list h4:before {
    content: "📋";
    font-size: 20px;
    }

    /* Empty state styling */
    .empty-ingredients {
    text-align: center;
    padding: 60px 20px;
    opacity: 0.6;
    font-style: italic;
    font-size: 16px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
    .ingredient-table {
        font-size: 13px;
    }
    
    .ingredient-table thead th,
    .ingredient-table tbody td {
        padding: 16px 20px;
    }
    
    .ingredient-table thead th {
        font-size: 11px;
    }
    
    .ingredient-table button {
        width: 36px;
        height: 36px;
        font-size: 16px;
    }
    }

    @media (max-width: 480px) {
    .ingredient-table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
    }
    
    .ingredient-table thead,
    .ingredient-table tbody,
    .ingredient-table th,
    .ingredient-table td,
    .ingredient-table tr {
        display: block;
    }
    
    .ingredient-table thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }
    
    .ingredient-table tr {
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-bottom: 12px;
        padding: 16px;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .ingredient-table td {
        border: none !important;
        padding: 12px 0;
        position: relative;
        white-space: normal;
        display: flex;
        align-items: center;
    }
    
    .ingredient-table td:before {
        content: attr(data-label) ": ";
        font-weight: 700;
        display: inline-block;
        width: 120px;
        opacity: 0.7;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    }
  `]
})

export class RecipesIngridientComponent implements OnInit, OnChanges {
    @Input() foodItemId: number | null = null;
    foodItemName: string = '';
    ingridients: any[] = [];
    recipeIngredients: any[] = [];
    ingredientForm!: FormGroup;
    showIngredientForm: boolean = false;
    editingIngredientId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private recipeIngredientService: RecipeService,
        private masterRecordService: MasterRecordService,
        private foodService: FoodItemService
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['foodItemId']) {
            const newId = changes['foodItemId'].currentValue;
            if (newId !== null) {
                this.openIngredientForm(newId);
                this.getFoodItemName(newId);
            }
        }
    }

    initForm(): void {
        this.ingredientForm = this.fb.group({
            inventory_item_id: [null, Validators.required],
            quantity: [null, [Validators.required, Validators.min(0.01)]],
            unit: [{ value: '', disabled: true }]
        });
    }
    getFoodItemName(id: number): void {
        this.foodService.getFoodItems().subscribe((items: any[]) => {
            const found = items.find(item => item.id === id);
            this.foodItemName = found ? found.name : 'Unknown Item';
        });
    }

    openIngredientForm(foodItemId: number): void {
        this.foodItemId = foodItemId;
        this.initForm();
        this.showIngredientForm = true;
        this.loadRecipeIngredients();

        this.masterRecordService.getInventoryItemName().subscribe({
            next: (items) => {
                this.ingridients = items;

                this.ingredientForm.get('inventory_item_id')?.valueChanges.subscribe(selectedId => {
                    const selectedItem = this.ingridients.find(item => item.id === selectedId);
                    const unit = selectedItem ? selectedItem.unit : '';
                    this.ingredientForm.patchValue({ unit });
                });
            },
            error: (err) => {
                console.error('Error fetching inventory:', err);
            }
        });
    }


    closeIngredientForm(): void {
        this.showIngredientForm = false;
        this.ingredientForm.reset();
        this.foodItemId = null;
        this.editingIngredientId = null;
    }


    loadInventory(): void {
        this.masterRecordService.getInventoryItemName().subscribe({
            next: (items) => {
                this.ingridients = items;
            },
            error: (err) => {
                console.error('Error fetching inventory:', err);
            }
        });
    }

    loadRecipeIngredients(): void {
        if (!this.foodItemId) return;

        this.recipeIngredientService.getIngredientsByFoodItemId(this.foodItemId).subscribe({
            next: (res) => {
                this.recipeIngredients = res;
            },
            error: (err) => {
                console.error('Error loading recipe ingredients:', err);
            }
        });
    }

    editIngredient(ingredient: any): void {
        this.editingIngredientId = ingredient.id;

        this.showIngredientForm = true; // open the modal if it's not already

        this.ingredientForm.patchValue({
            inventory_item_id: ingredient.inventory_item.id,
            quantity: ingredient.quantity,
            unit: ingredient.inventory_item.unit
        });

        this.ingredientForm.get('inventory_item_id')?.valueChanges.subscribe(selectedId => {
            const selectedItem = this.ingridients.find(item => item.id === selectedId);
            const unit = selectedItem ? selectedItem.unit : '';
            this.ingredientForm.patchValue({ unit });
        });
    }

    deleteIngredient(id: number): void {
        const confirmed = window.confirm('Are you sure you want to delete this ingredient?');
        if (!confirmed) return;

        this.recipeIngredientService.deleteRecipeIngredient(id).subscribe({
            next: () => {
                this.loadRecipeIngredients(); // Refresh list
            },
            error: (err) => {
                console.error('Error deleting ingredient:', err);
            }
        });
    }


    submitIngredient(): void {
        if (!this.foodItemId || this.ingredientForm.invalid) return;

        const payload = {
            food_item_id: this.foodItemId,
            inventory_item_id: this.ingredientForm.value.inventory_item_id,
            quantity: this.ingredientForm.value.quantity
        };

        if (this.editingIngredientId) {
            this.recipeIngredientService.updateRecipeIngredient(this.editingIngredientId, payload).subscribe({
                next: () => {
                    console.log('Ingredient updated');
                    this.closeIngredientForm();
                    this.loadRecipeIngredients();
                },
                error: (err) => {
                    console.error('Error updating ingredient:', err);
                }
            });
        } else {
            this.recipeIngredientService.addRecipeIngridients(payload).subscribe({
                next: () => {
                    console.log('Ingredient added');
                    this.closeIngredientForm();
                    this.loadRecipeIngredients();
                },
                error: (err) => {
                    console.error('Error adding ingredient:', err);
                }
            });
        }
    }
}
