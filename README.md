# Kitchen Management Frontend

Angular-based web application for comprehensive kitchen management, including inventory tracking, meal planning, employee management, and consumption monitoring.

## Features

- **Dashboard** - Overview of kitchen operations and key metrics
- **Inventory Management** - Track inventory items, stock levels, and movements
- **Recipe Management** - Create and manage recipes with ingredients
- **Daily Menu Planning** - Plan and publish daily menus
- **Employee Management** - Manage staff, roles, and sign-ins
- **Meal Tracking** - Track individual and overall consumption
- **Wastage Management** - Monitor and report food wastage
- **Subscriptions** - Manage meal subscriptions
- **Reporting** - Generate reports with custom filters and Excel exports
- **Role-based Access Control** - Admin and user permissions

## Tech Stack

- **Angular** 17+
- **Angular Material** - UI components
- **TypeScript**
- **RxJS** - Reactive programming
- **Node.js** & npm

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI (`npm install -g @angular/cli`)

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/manojrammurthy/Kitchenfrontend.git
cd kitchen-frontend

npm install

```

Create src/environments/environment.ts:
```
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```
create src/environments/environment.prod.ts
```
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

#serving 
```
ng serve
```

API Integration
The application connects to a Django REST API backend. Configure the API URL in environment files:

Development: src/environments/environment.ts

Production: src/environments/environment.prod.ts

Authentication
The app uses JWT token-based authentication:

Login credentials are validated via /api/auth/login/

Token is stored in localStorage

HTTP interceptor automatically adds token to all requests

Guards protect routes requiring authentication

Key Features Detail
Inventory Management
Real-time inventory tracking

Stock level monitoring

Movement history

Wastage recording

Recipe & Menu Planning
Create recipes with ingredients and quantities

Plan daily menus

Link recipes to food items

Track ingredient usage

Employee & Consumption Tracking
Employee sign-in/sign-out

Individual meal consumption tracking

Subscription management

Consumption reports

Reporting & Export
Customizable date range filters

Excel export functionality

Visual dashboards with charts

Master record reports

Deployment
