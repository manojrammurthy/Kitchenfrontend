export interface InventoryItem {
  id: number;
  name: {
    id: number;
    name: string;
    unit: string;
    minimum_stock: number | string;
    is_active: boolean;
    category: {
      id: number;
      category: string;
      is_active: boolean;
    };
  };
  category?: {   // ✅ Add this to support form display
    id: number;
    category: string;
    is_active: boolean;
  };
  kitchen_location: {
    id: number;
    name: string;
  };
  quantity?: number;
  unit: string;
  purchase_date: Date;
  expiry_date: Date;
  created_at: Date;
  purchase_price: number;
  price_before_tax: number;
  tax_amount: number;
  tax_percentage: number;
  current_stock: number;
  purchase_quantity: number;
  minimum_stock: number;
  last_updated: Date;
  notes: string;
  is_active: boolean;
}



export interface InventoryItemName {
  id: number;
  name: string;
  unit: string;
}

export interface Category {
  id: number;
  category: string;
}

export enum UnitType {
  KG = 'kg',
  GRAM = 'g',
  LITER = 'L',
  ML = 'ml',
  PIECE = 'pc',
  DOZEN = 'dozen',
  BOX = 'box',
  PACKET = 'packet'
}

export const MonthType = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
