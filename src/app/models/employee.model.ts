export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  programme: string;
  function: string;
  phone?: string;
  joining_date: Date;
  work_location: {
    id: number;
    name: string;
  };
  is_active: boolean;
  profile_image?: string;
  last_sign_in?: Date;
}


// export interface User {
//   id: number;
//   username: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   is_staff: boolean;
//   full_name: string;
//   role: string;
// }

export interface MealConsumption {
  id: number;
  employee: number;
  date: string;
  meal: MealType;
  rate: number;
  notes?: string;
  additional_people?: string;
  createdAt: string;
  employee_obj?: Employee;
  employee_name?: string;
  employee_id?: string;
  date_only?: string;
  time_only?: string;
}

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  SNACK = 'snack',
  DINNER = 'dinner',
}


export interface ProgrammeDepartments {
  programme: string;
  departments: string[];
}

export const PROGRAMME_DEPARTMENT_DATA: ProgrammeDepartments[] = [
  {
    programme: 'Academics & Research',
    departments: [
      'Academics & Research',
      'Academic Office',
      'Academic Outreach & Career Development',
      'Library',
      'Research Office'
    ]
  },
  {
    programme: 'Urban Practitioners’ Programme',
    departments: ['Urban Practitioners’ Programme']
  },
  {
    programme: 'Digital Blended Learning',
    departments: ['Digital Blended Learning']
  },
  {
    programme: 'Labs',
    departments:
      ['Environmental Lab',
        'GeoSpatial Lab',
        'IoT Lab',
        'LTUEO (Long-Term Urban Ecological Observatory)',
        'Media Lab',
        'Sustainable Energy Lab',
        'Urban Informatics Lab',
        'Word Lab'
      ]
  },
  {
    programme: 'Operations',
    departments:
      ['Administration',
        'Campus Development',
        'Communications and Design',
        'Finance & Accounts',
        'Information Technology',
        'Legal & Regulation',
        'People Function',
        'Resource Development',
        'Senior Leadership'
      ]
  }
];
