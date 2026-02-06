import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { ConsumptionComponent } from './pages/consumption/consumption.component';
import { MealTrackerComponent } from './pages/meal-tracker/meal-tracker';
import { WastageComponent } from './pages/wastage/wastage.component';
import { LoginComponent } from './pages/login/login.component';
// import { SubscriptionsComponent } from './pages/subscriptions/subscriptions.component';
import { MasterComponent } from './pages/master-record/master-record';
import { AdminGuard } from './guards/admin.guard';
import { LoginGuard } from './guards/login.guard';
import { fullInventoryComponent } from './pages/full-inventory/full-inventory';
import { IndividualConsumptionComponent } from './pages/individual-consumption/individual-consumption';
import { UserManagementComponent } from './pages/user-management.component';
import { FoodItemsComponent } from './pages/food-items/food-items.component';
import { DailyMenuComponent } from './pages/daily-menu/daily-menu.component';
import { InventoryWastageComponent } from './pages/inventory-wastage/inventory-wastage';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] }, 
  // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'inventory', component: InventoryComponent },
  { path: 'employees', component: EmployeesComponent, canActivate: [AdminGuard] },

  { path: 'consumption', component: ConsumptionComponent },
  { path: 'individual-consumption', component: IndividualConsumptionComponent },
  { path: 'meal-tracker', component: MealTrackerComponent },
  { path: 'master-record', component: MasterComponent, canActivate: [AdminGuard] },
  { path: 'admin_panel', component: UserManagementComponent, canActivate: [AdminGuard] },
  { path: 'full-inventory', component: fullInventoryComponent, canActivate: [AdminGuard] },
  { path: 'wastage', component: WastageComponent },
  { path: 'inventory-wastage', component: InventoryWastageComponent },
  { path: 'food-item', component: FoodItemsComponent, canActivate: [AdminGuard] },
  { path: 'daily-menu', component: DailyMenuComponent, canActivate: [AdminGuard] },
  // { path: 'subscribtion', component: SubscriptionsComponent },
  { path: '**', redirectTo: 'dashboard' }
];