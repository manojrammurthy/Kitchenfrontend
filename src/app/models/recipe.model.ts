export interface Recipe {
  id: number;
  foodItemId: number;
  name: string;
  description?: string;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  preparationTime: number;
  cookingTime: number;
  totalTime: number;
  difficulty: RecipeDifficulty;
  isActive: boolean;
}

export interface RecipeIngredient {
  inventoryItemId: number;
  name: string;
  quantity?: number;
  unit: string;
}

export enum RecipeDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface RecipeCalculation {
  recipe: Recipe;
  requiredServings: number;
  ingredients: IngredientCalculation[];
  canPrepare: boolean;
  missingIngredients: MissingIngredient[];
}

export interface IngredientCalculation {
  inventoryItemId: number;
  name: string;
  required: number;
  available: number;
  unit: string;
  sufficient: boolean;
}

export interface MissingIngredient {
  inventoryItemId: number;
  name: string;
  quantity: number;
  unit: string;
}