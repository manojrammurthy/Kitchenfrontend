import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidenavComponent,
    // DashboardComponent
  ],
  template: `
  <div class="layout">
    <app-sidenav *ngIf="showShell" class="sidenav"></app-sidenav>

    <div class="main-column">
      <div class="">
        <app-header *ngIf="showShell"></app-header>
      </div>

      <div class="">
        <router-outlet></router-outlet>
      </div>
    </div>
  </div>








  `,
  styles: [`
.layout {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
}

.sidenav {
  width: 250px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  height: 100%;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.main-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}

.header-box {
  height: 64px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.content-box {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}


`]
})
export class App {
  title = 'Kitchen Inventory Management';

  private hiddenRoutes = ['/', '/login'];
  showShell = true;

  constructor(private router: Router) {
    // Flip the switch on every completed nav
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        this.showShell = !this.hiddenRoutes.includes(url);
      });
  }

}