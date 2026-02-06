// export interface FoodItem {
//   name: string;
//   kitchen_location_id: number;
//   meal_types: string;
//   preparation_type: string;
// }

export interface Ingredient {
  id: number;
  itemId: number;
  quantity: number;
  unit: string;
}

export interface MealSubscription {
  id: number;
  employeeId: number;
  subscribedBy: number; // Admin user ID
  mealTypes: string[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}