// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-sidenav',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   template: `
//     <div class="sidenav">
//       <nav class="sidenav-menu">
//         <a *ngIf="isAdmin" routerLink="/dashboard" routerLinkActive="active" class="sidenav-item">
//           <span class="icon">📊</span>
//           <span class="text">Dashboard</span>
//         </a>
//         <a *ngIf="isAdmin" routerLink="/inventory" routerLinkActive="active" class="sidenav-item">
//           <span class="icon">🥘</span>
//           <span class="text">Recent Inventory</span>
//         </a>
//         <a *ngIf="isAdmin" routerLink="/full-inventory" routerLinkActive="active" class="sidenav-item">
//           <span class="icon">🥘</span>
//           <span class="text">Complete Stock</span>
//         </a>
//         <a *ngIf="isAdmin" routerLink="/recipes" routerLinkActive="active" class="sidenav-item">
//           <span class="icon">📖</span>
//           <span class="text">Recipes</span>
//         </a>
//         <a *ngIf="isAdmin" routerLink="/employees" routerLinkActive="active" class="sidenav-item">
//           <span class="icon">👥</span>
//           <span class="text">Employees</span>
//         </a>
//         <a ngI routerLink="/meal-tracker" routerLinkActive="active" class="sidenav-item">
//           <span class="icon">🍽️</span>
//           <span class="text">Meal Tracker</span>
//         </a>
//         <a routerLink="/consumption" routerLinkActive="active" class="sidenav-item">
//           <span class="icon">🍽️</span>
//           <span class="text">Consumption</span>
//         </a>
//         <a routerLink="/individual-consumption" routerLinkActive="active" class="sidenav-item">
//           <span class="icon">🍽️</span>
//           <span class="text">Individual Consumption</span>
//         </a>
//         <a routerLink="/wastage" routerLinkActive="active" class="sidenav-item">
//           <span class="icon">🗑️</span>
//           <span class="text">Wastage</span>
//         </a>
//         <a *ngIf="isAdmin" routerLink="/master-record" routerLinkActive="active" class="sidenav-item">
//           <span class="icon">📋</span>
//           <span class="text">Master Record</span>
//         </a>
//       </nav>
//     </div>
//   `,
//   styles: [`
//     .sidenav {
//       width: 220px;
//       background-color: white;
//       border-right: 1px solid var(--neutral-200);
//       height: 100%;
//       overflow-y: auto;
//     }

//     .sidenav-menu {
//       display: flex;
//       flex-direction: column;
//       padding: var(--space-2);
//     }

//     .sidenav-item {
//       display: flex;
//       align-items: center;
//       gap: var(--space-2);
//       padding: var(--space-2);
//       color: var(--neutral-700);
//       text-decoration: none;
//       border-radius: var(--radius-md);
//       margin-bottom: var(--space-1);
//       transition: all 0.2s ease;
//     }

//     .sidenav-item:hover {
//       background-color: var(--neutral-100);
//       color: var(--primary-700);
//       text-decoration: none;
//     }

//     .sidenav-item.active {
//       background-color: var(--primary-50);
//       color: var(--primary-700);
//       font-weight: 500;
//     }

//     .icon {
//       font-size: 1.25rem;
//       width: 24px;
//       text-align: center;
//     }

//     .mobile-only {
//       display: none;
//     }

//     @media (max-width: 768px) {
//       .sidenav {
//         width: 100%;
//         border-right: none;
//         border-bottom: 1px solid var(--neutral-200);
//         height: auto;
//         max-height: 60px;
//         overflow-x: auto;
//       }

//       .sidenav-menu {
//         flex-direction: row;
//         padding: var(--space-1);
//         overflow-x: auto;
//       }

//       .sidenav-item {
//         flex-direction: column;
//         gap: var(--space-1);
//         padding: var(--space-1);
//         text-align: center;
//         min-width: 60px;
//       }

//       .text {
//         font-size: 0.75rem;
//       }

//       .mobile-only {
//         display: flex;
//       }
//     }
//   `]
// })
// export class SidenavComponent {
//   constructor(private authService: AuthService) {}

//   isAdmin: boolean = false;

//   ngOnInit(): void {
//     const user = this.authService.getCurrentUser();

//     if (user) {
//       const role = user.role?.toLowerCase();
//       console.log('Logged in user role:', role);
//       this.isAdmin = role === 'admin';
//     } else {
//       console.log('No user found');
//     }
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidenav">
      <!-- Brand Header -->
      <div class="sidenav-header">
        <div class="brand-section">
          <div class="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="brand-text">
            <h3 class="brand-title">Kitchen System</h3>
            <p class="brand-subtitle">Management Portal</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidenav-menu">
        <!-- Admin Section -->
        <div *ngIf="isAdmin" class="menu-section">
          <div class="section-header">
            <span class="section-title">Administration</span>
          </div>
          
          <a routerLink="/dashboard" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Dashboard</span>
          </a>

          <a routerLink="/inventory" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" stroke-width="2"/>
                <polyline points="7.5,4.21 12,6.81 16.5,4.21" stroke="currentColor" stroke-width="2"/>
                <polyline points="7.5,19.79 7.5,14.6 3,12" stroke="currentColor" stroke-width="2"/>
                <polyline points="21,12 16.5,14.6 16.5,19.79" stroke="currentColor" stroke-width="2"/>
                <polyline points="12,22.08 12,17" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Recent Inventory</span>
          </a>

          <a routerLink="/full-inventory" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8L12 12L21 8Z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 12L12 22.08" stroke="currentColor" stroke-width="2"/>
                <path d="M12 12L3 8" stroke="currentColor" stroke-width="2"/>
                <path d="M12 12L21 8" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Complete Stock</span>
          </a>
          <a routerLink="/food-item" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" stroke-width="2"/>
                <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" stroke-width="2"/>
                <path d="M9 7H15" stroke="currentColor" stroke-width="2"/>
                <path d="M9 11H15" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Food Item</span>
          </a>
          <a routerLink="/daily-menu" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <!-- Hamburger icon SVG -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18v2H3V6zM3 11h18v2H3v-2zM3 16h18v2H3v-2z"
                      fill="currentColor"/>
              </svg>
            </div>
            <span class="item-text">Daily Menu</span>
          </a>
          <a routerLink="/employees" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Employees</span>
          </a>

          <a routerLink="/master-record" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Master Record</span>
          </a>

          <a routerLink="/admin_panel" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 5V11C4 16.52 7.58 21.74 12 23C16.42 21.74 20 16.52 20 11V5L12 2Z" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="11" r="2" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 13V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M15 11H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 11H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
            </div>
            <span class="item-text">Admin Panel</span>
          </a>
        </div>

        <!-- Operations Section -->
        <div class="menu-section">
          <div class="section-header">
            <span class="section-title">Operations</span>
          </div>

          <a routerLink="/meal-tracker" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Meal Tracker</span>
          </a>

          <a routerLink="/consumption" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12H12V3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z" stroke="currentColor" stroke-width="2"/>
                <path d="M21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3V12H21Z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Consumption</span>
          </a>

          <a routerLink="/individual-consumption" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M8 21L16 21" stroke="currentColor" stroke-width="2"/>
                <path d="M12 17V21" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Individual Consumption</span>
          </a>

          <a routerLink="/inventory-wastage" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2"/>
                <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="2"/>
                <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Inventory Wastage</span>
          </a>

          <a routerLink="/wastage" routerLinkActive="active" class="sidenav-item">
            <div class="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2"/>
                <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="2"/>
                <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="item-text">Kitchen Wastage</span>
          </a>
        </div>
      </nav>

      <!-- User Profile Section -->
      <div class="sidenav-footer">
        <div class="user-profile">
          <div class="user-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="user-info">
            <p class="user-name">{{ isAdmin ? 'Administrator' : 'Staff Member' }}</p>
            <p class="user-role">{{ isAdmin ? 'Admin Access' : 'Standard Access' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    
    .sidenav {
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      font-family: 'Inter', sans-serif;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      overflow-y: auto;
    }

    /* Brand Header */
    .sidenav-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .brand-text {
      flex: 1;
    }

    .brand-title {
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      opacity: 0.9;
      margin: 0;
      font-weight: 500;
    }

    /* Navigation Menu */
    .sidenav-menu {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
    }

    .menu-section {
      margin-bottom: 1.5rem;
    }

    .section-header {
      padding: 0 1.5rem 0.5rem;
      margin-bottom: 0.5rem;
    }

    .section-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sidenav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: #475569;
      text-decoration: none;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
      position: relative;
    }

    .sidenav-item:hover {
      background: linear-gradient(90deg, rgba(40, 167, 69, 0.08) 0%, rgba(40, 167, 69, 0.02) 100%);
      color: #28a745;
      text-decoration: none;
      border-left-color: rgba(40, 167, 69, 0.3);
    }

    .sidenav-item.active {
      background: linear-gradient(90deg, rgba(40, 167, 69, 0.15) 0%, rgba(40, 167, 69, 0.05) 100%);
      color: #28a745;
      font-weight: 600;
      border-left-color: #28a745;
    }

    .sidenav-item.active::before {
      content: '';
      position: absolute;
      right: 1.5rem;
      width: 6px;
      height: 6px;
      background: #28a745;
      border-radius: 50%;
    }

    .item-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-text {
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.2;
    }

    /* User Profile Footer */
    .sidenav-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0;
      font-weight: 500;
    }

    /* Scrollbar Styling */
    .sidenav::-webkit-scrollbar {
      width: 4px;
    }

    .sidenav::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidenav::-webkit-scrollbar-thumb {
      background: rgba(40, 167, 69, 0.3);
      border-radius: 2px;
    }

    .sidenav::-webkit-scrollbar-thumb:hover {
      background: rgba(40, 167, 69, 0.5);
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .sidenav {
        width: 100%;
        height: auto;
        position: relative;
        box-shadow: none;
        border-right: none;
        border-bottom: 1px solid #e2e8f0;
      }

      .sidenav-header {
        padding: 1rem;
      }

      .brand-title {
        font-size: 1rem;
      }

      .brand-subtitle {
        display: none;
      }

      .sidenav-menu {
        padding: 0.5rem 0;
        max-height: 300px;
        overflow-y: auto;
      }

      .menu-section {
        margin-bottom: 1rem;
      }

      .sidenav-item {
        padding: 0.625rem 1rem;
      }

      .item-text {
        font-size: 0.8125rem;
      }

      .sidenav-footer {
        padding: 1rem;
      }

      .user-profile {
        padding: 0.625rem;
      }

      .user-avatar {
        width: 32px;
        height: 32px;
      }

      .user-name {
        font-size: 0.8125rem;
      }

      .user-role {
        font-size: 0.6875rem;
      }
    }

    @media (max-width: 480px) {
      .sidenav-header {
        padding: 0.75rem;
      }

      .brand-section {
        gap: 0.5rem;
      }

      .brand-icon {
        width: 32px;
        height: 32px;
      }

      .brand-title {
        font-size: 0.9375rem;
      }

      .sidenav-item {
        padding: 0.5rem 0.75rem;
        gap: 0.5rem;
      }

      .item-icon {
        width: 18px;
        height: 18px;
      }

      .item-text {
        font-size: 0.75rem;
      }

      .section-title {
        font-size: 0.6875rem;
        padding: 0 0.75rem 0.375rem;
      }
    }
  `]
})
export class SidenavComponent {
  constructor(private authService: AuthService) { }

  isAdmin: boolean = false;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    console.log("sidenav user",user)
    if (user) {
      console.log("side nav", user.role)
      const role = user.role?.toLowerCase();
      this.isAdmin = role === 'admin';
    } else {
      console.log('No user found');
    }
  }
}