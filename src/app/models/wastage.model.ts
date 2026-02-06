export interface Wastage {
  kitchen_name: any;
  id: number;
  itemId: number;
  itemName: string;
  quantity: number;
  unit: string;
  food_item: number;
  food_item_name?: string;
  wastage_date: string;
  reason: WastageReason;
  reportedBy: string;
  cost: number;
  notes?: string;
  date: Date;
}

export enum WastageReason {
  EXPIRED = 'Expired',
  SPOILED = 'Spoiled',
  OVERCOOKED = 'Overcooked',
  LEFTOVERS = 'Leftovers',
  DAMAGED = 'Damaged during storage',
  PREPARATION = 'Preparation waste',
  OTHER = 'Other'
}

export interface TransformedWastage {
  id: number;
  kitchen_name: string;
  food_item_name: string;
  quantity: number;
  unit: string;
  wastage_date: string;
  reason: string;
  notes: string;
  type: 'prepared' | 'raw';
}
