export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee'
}

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  employeeId?: number;
  isActive: boolean;
  lastLogin?: Date;

  location?: {
    id: number;
    name: string;
  };
}


export enum Location {
  KENGERI = 'Kengeri',
  BCC = 'BCC',
  ANNEX1 = 'Annex 1',
  ANNEX2 = 'Annex 2',
  ANNEX3 = 'Annex 3',
}