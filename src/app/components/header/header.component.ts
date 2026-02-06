import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
   <header class="header">
    <div class="logout-container" style="display: flex; justify-content: flex-end; width: 100%; position: relative;">
      <!-- User Info: Username and Icon -->
      <div *ngIf="user" class="user-info" (click)="toggleDropdown()">
        <mat-icon class="user-icon">account_circle</mat-icon>
        <span class="user-name">{{ user.username }}</span>
        <mat-icon class="dropdown-icon">{{ showDropdown ? 'arrow_drop_up' : 'arrow_drop_down' }}</mat-icon>
      </div>

      <!-- Dropdown for Logout -->
      <div *ngIf="showDropdown" class="dropdown-menu">
        <button (click)="logout()" class="logout-button">
          <mat-icon class="button-icon">logout</mat-icon>
          Logout
        </button>

        <!-- <button class="reset-button">
          <mat-icon class="button-icon">vpn_key</mat-icon>
          Reset Password</button> -->
      </div>
    </div>
    
  </header>

  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 64px;
      background-color: rgb(238, 238, 240);
      box-shadow: var(--shadow-md);
      position: relative;
      z-index: 10;
      width: 100%;
      margin: 0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer; /* Make the whole user info clickable */
    }

    .user-name {
      font-weight: bold;
      margin-right: 8px;
    }

    .user-icon {
      font-size: 1.5rem;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: #fff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 8px;
      border-radius: 6px;
      z-index: 100;
    }

    .logout-button {
      background-color: #ec5f01ff;
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      width: 100%;
    }

    .logout-button:hover {
      background-color: #e49b48ff;
    }
    .reset-button {
      background-color: #f0e005ff;
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      width: 100%;
    }

    .reset-button:hover {
      background-color: #e7e96cff;
    }

    @media (max-width: 768px) {
      .logout-container {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  user: any;  // Ensure the 'user' property is defined here
  showDropdown: boolean = false;  // Control the visibility of the dropdown menu

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Fetch the current user from AuthService
    this.user = this.authService.getCurrentUser();
  }

  toggleDropdown() {
    // Toggle the dropdown visibility
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    // Clear any stored tokens or user info if needed
    localStorage.clear();
    sessionStorage.clear();

    // Navigate back to login
    this.router.navigate(['/login']);
  }
}
