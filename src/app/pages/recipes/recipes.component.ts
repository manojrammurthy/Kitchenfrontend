import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatSlideToggleModule],
  template: `
   <div class="modal" *ngIf="showRecipeForm" (click)="closeRecipeForm()">
  <div class="modal-content slide-in-up" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <h3>{{ editingRecipe ? 'Edit Recipe' : 'Add Recipe' }}</h3>
      <button class="btn-close" (click)="closeRecipeForm()">×</button>
    </div>

    <form [formGroup]="recipeForm" class="modal-body form-container">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>
        <input matInput formControlName="description" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Servings</mat-label>
        <input matInput type="number" formControlName="servings" readonly/>
      </mat-form-field>

      <div class="mt-4">
  <label class="font-semibold">Instructions</label>

  <div *ngFor="let instr of instructions.controls; let i = index; trackBy: trackByIndex"
       class="instruction-row">
    <mat-form-field appearance="outline" class="instruction-field">
      <input matInput [formControl]="instr" placeholder="Enter step" />
    </mat-form-field>
    <button mat-icon-button color="warn" (click)="removeInstruction(i)">
      <mat-icon>delete</mat-icon>
    </button>
  </div>

  <button mat-button color="primary" (click)="addInstruction()">+ Add Instruction</button>
</div>


      <div class="time-fields">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Prep Time (min)</mat-label>
          <input matInput type="number" formControlName="preparation_time" placeholder="e.g. 10" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cook Time (min)</mat-label>
          <input matInput type="number" formControlName="cooking_time" placeholder="e.g. 20" />
        </mat-form-field>

      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Difficulty</mat-label>
        <mat-select formControlName="difficulty">
          <mat-option *ngFor="let level of ['Easy', 'Medium', 'Hard']" [value]="level">{{ level }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-slide-toggle formControlName="is_active">Active</mat-slide-toggle>
    </form>

    <div class="modal-footer">
      <button mat-button (click)="closeRecipeForm()">Cancel</button>
      <button mat-flat-button color="primary" (click)="submitRecipe()">Save</button>
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

    .recipe-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--space-3);
    }

    .recipe-card {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-3);
      box-shadow: var(--shadow-sm);
      width: 430px;
    }

    .recipe-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .recipe-header h3 {
      margin: 0;
    }

    .badge {
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .badge-easy { background-color: #E8F5E9; color: #2E7D32; }
    .badge-medium { background-color: #FFF8E1; color: #F57F17; }
    .badge-hard { background-color: #FFEBEE; color: #C62828; }

    .recipe-description {
      color: var(--neutral-600);
      margin-bottom: var(--space-3);
    }

    .recipe-details {
      display: flex;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .ingredient-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
    }

    .ingredient-field {
      flex: 2;
      min-width: 200px;
    }

    .quantity-field {
      flex: 1;
      min-width: 100px;
    }

    .unit-field {
      flex: 1;
      min-width: 100px;
    }

    .delete-button {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .calculation-section {
      background-color: var(--neutral-100);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      margin: var(--space-3) 0;
    }

    .servings-calculator {
      margin-bottom: var(--space-3);
    }

    .servings-input {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .servings-input input {
      width: 80px;
      text-align: center;
    }

    .status-indicator {
      padding: var(--space-2);
      border-radius: var(--radius-md);
      background-color: var(--error);
      color: white;
      text-align: center;
      margin-bottom: var(--space-3);
    }

    .status-indicator.success {
      background-color: var(--success);
    }

    .ingredients-status {
      margin-bottom: var(--space-3);
    }

    .ingredient-status {
      display: flex;
      justify-content: space-between;
      padding: var(--space-1) 0;
      border-bottom: 1px solid var(--neutral-200);
    }

    .ingredient-status.insufficient {
      color: var(--error);
    }

    .missing-ingredients {
      background-color: var(--neutral-200);
      border-radius: var(--radius-md);
      padding: var(--space-3);
    }

    .recipe-actions {
      display: flex;
      gap: var(--space-2);
      justify-content: flex-end;
      margin-top: var(--space-3);
    }

    .instruction-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.instruction-field {
  flex: 1;
}


    .ingredients-form, .instructions-form {
      margin-bottom: var(--space-3);
    }

    .ingredient-item, .instruction-item {
      display: flex;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
    }

    @media (max-width: 768px) {
      .recipe-grid {
        grid-template-columns: 1fr;
      }

      .ingredient-item {
        flex-direction: column;
      }
    }
  `]
})

export class RecipesComponent implements OnInit, OnChanges {

  private _foodItemId: number | null = null;

  @Input()
  set foodItemId(value: number | null) {
    if (value !== null && value !== this._foodItemId) {
      this._foodItemId = value;
      this.openRecipeForm(value); // ← always open the form when foodItemId changes
    }
  }


  showRecipeForm = false;
  editingRecipe = false;
  selectedFoodItemId: number | null = null;
  editingRecipeId: number | null = null;
  recipeInstructionsText = '';
  recipeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['foodItemId']) {
      const newId = changes['foodItemId'].currentValue;
      if (newId !== null) {
        this.openRecipeForm(newId);
      }
    }
  }

  initForm(): void {
    this.recipeForm = this.fb.group({
      description: ['', Validators.required],
      servings: [10, [Validators.required, Validators.min(1)]],
      instructions: this.fb.array([]),  // changed
      preparation_time: [null, Validators.required],
      cooking_time: [null, Validators.required],
      difficulty: ['Easy', Validators.required],
      is_active: [true]
    });
  }

  get instructions(): FormArray<FormControl<string>> {
    return this.recipeForm.get('instructions') as FormArray<FormControl<string>>;
  }


  openRecipeForm(foodItemId: number): void {
    this.selectedFoodItemId = foodItemId;
    this.initForm(); // reset form and instructions
    this.editingRecipe = false;
    this.editingRecipeId = null; // reset

    this.recipeService.getRecipeByFoodItem(foodItemId).subscribe({
      next: (data) => {
        if (data) {
          this.recipeForm.patchValue({
            ...data,
            instructions: [] // avoid patching instructions directly
          });

          this.instructions.clear();
          if (data.instructions && data.instructions.length > 0) {
            data.instructions.forEach((step: string) => {
              this.instructions.push(this.fb.nonNullable.control(step ?? ''));
            });
          } else {
            this.instructions.push(this.fb.nonNullable.control(''));
          }

          this.editingRecipe = true;
          this.editingRecipeId = data.id; // ✅ capture actual recipe ID
        } else {
          this.instructions.push(this.fb.nonNullable.control(''));
        }
        this.showRecipeForm = true;
      },
      error: () => {
        this.instructions.push(this.fb.nonNullable.control(''));
        this.showRecipeForm = true;
      }
    });
  }

  closeRecipeForm(): void {
    this.showRecipeForm = false;
    this.recipeForm.reset();
    this.recipeInstructionsText = '';
    this.selectedFoodItemId = null;
  }

  submitRecipe(): void {
    if (this.recipeForm.invalid) return;

    const recipePayload = {
      ...this.recipeForm.value,
      food_item_id: this.selectedFoodItemId,
      instructions: this.instructions.value.filter((i: string) => i.trim())
    };
    console.log('Submitting recipe:', recipePayload);

    const req = this.editingRecipe && this.editingRecipeId
      ? this.recipeService.updateRecipe(this.editingRecipeId, recipePayload)
      : this.recipeService.addRecipe(recipePayload);

    req.subscribe({
      next: () => {
        this.closeRecipeForm();
      },
      error: (err) => {
        console.error('Error saving recipe:', err);
      }
    });
  }


  addInstruction(): void {
    this.instructions.push(this.fb.nonNullable.control(''));
  }

  removeInstruction(index: number): void {
    this.instructions.removeAt(index);
  }
  trackByIndex(index: number): number {
    return index;
  }
}
