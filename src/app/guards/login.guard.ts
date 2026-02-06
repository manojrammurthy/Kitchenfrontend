import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      // If user is already logged in, redirect them to the appropriate dashboard
      const user = JSON.parse(currentUser);
      if (user.role === 'admin') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/meal-tracker']);
      }
      return false; // Prevent access to login page
    }
    return true; // Allow access to login page if not logged in
  }
}
