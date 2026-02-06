import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';
import { Recipe, RecipeCalculation, RecipeDifficulty } from '../models/recipe.model';
import { InventoryService } from './inventory.service';
import { environment } from '../../environments/environment';

const INVENTORY_API = environment.apiUrl;

const token = localStorage.getItem('accessToken');
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
};

@Injectable({
  providedIn: 'root'
})

export class RecipeService {

  constructor(private http: HttpClient) { }

  getRecipeIngridients(): Observable<any[]> {
    return this.http.get<any>(INVENTORY_API + 'ingredients/', httpOptions);
  }

  getIngredientsByFoodItemId(foodItemId: number): Observable<any[]> {
    return this.http.get<any[]>(`${INVENTORY_API}ingredients/?food_item_id=${foodItemId}`);
  }

  addRecipeIngridients(payload: any): Observable<any> {
    return this.http.post<any>(INVENTORY_API + 'ingredients/', payload, httpOptions)
  }

  updateRecipeIngredient(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${INVENTORY_API}ingredients/${id}/`, payload);
  }

  uploadRecipeIngridient(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(INVENTORY_API + 'ingredients/upload-data/', formData);
  }

  calculateStockAvailability(foodItemId: number, kitchenLocation: number, noOfServes: number): Observable<any> {
    const params = new HttpParams()
      .set('id', foodItemId.toString())
      .set('kitchen_location', kitchenLocation.toString())
      .set('no_of_serves', noOfServes.toString());

    return this.http.get<any>(`${INVENTORY_API}food-items/calculate-availability/`, { params });
  }

  deleteRecipeIngredient(id: number): Observable<any> {
    return this.http.delete(`${INVENTORY_API}ingredients/${id}/`, httpOptions);
  }


  getRecipes(): Observable<any[]> {
    return this.http.get<any>(INVENTORY_API + 'recipes/', httpOptions);
  }

  getRecipe(id: number): Observable<any> {
    return this.http.get<Recipe>(`${INVENTORY_API}recipes/${id}/`, httpOptions);
  }

  getRecipeByFoodItem(foodItemId: number): Observable<Recipe | null> {
    return this.http.get<Recipe[]>(`${INVENTORY_API}recipes/?food_item_id=${foodItemId}`).pipe(
      map(recipes => recipes.length ? recipes[0] : null)
    );
  }

  addRecipe(payload: any): Observable<any> {
    return this.http.post<any>(INVENTORY_API + 'recipes/', payload, httpOptions);
  }

  updateRecipe(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${INVENTORY_API}recipes/${id}/`, payload, httpOptions);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${INVENTORY_API}recipes/${id}/`, httpOptions);
  }
  uploadRecipeFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(INVENTORY_API + 'recipes/upload-data/', formData);
  }

  calculateRecipeRequirements(recipeId: number, servings: number): Observable<any> {
    return this.getRecipe(recipeId).pipe(
      map((recipe: any) => {
        if (!recipe) {
          throw new Error('Recipe not found');
        }

        const servingRatio = servings / (recipe.servings || 1);

        const ingredients = (recipe.ingredients || []).map((ingredient: any) => {
          const requiredQuantity = (ingredient.quantity ?? 0) * servingRatio;
          const available = 20; // Hardcoded for now; replace with actual stock if needed

          return {
            inventoryItemId: ingredient.inventoryItemId,
            name: ingredient.name,
            required: requiredQuantity,
            available,
            unit: ingredient.unit,
            sufficient: available >= requiredQuantity
          };
        });

        const missingIngredients = ingredients
          .filter((ing: any) => !ing.sufficient)
          .map((ing: any) => ({
            inventoryItemId: ing.inventoryItemId,
            name: ing.name,
            quantity: ing.required - ing.available,
            unit: ing.unit
          }));
        return {
          recipe,
          requiredServings: servings,
          ingredients,
          canPrepare: missingIngredients.length === 0,
          missingIngredients
        };
      })
    );
  }


}