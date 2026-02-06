import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-filter">
      <div class="filter-group">
        <label>Month</label>
        <select [(ngModel)]="selectedMonth" (change)="applyFilter()" class="form-control">
          <option *ngFor="let month of months; let i = index" [value]="i">
            {{ month }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Year</label>
        <select [(ngModel)]="selectedYear" (change)="applyFilter()" class="form-control">
          <option *ngFor="let year of years" [value]="year">{{ year }}</option>
        </select>
      </div>

      <button class="btn-primary" (click)="exportData()">
        Export to Excel
      </button>
    </div>
  `,
  styles: [`
    .report-filter {
      display: flex;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
      padding: var(--space-3);
      background: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    @media (max-width: 768px) {
      .report-filter {
        flex-direction: column;
      }
    }
  `]
})
export class ReportFilterComponent {
  @Output() filterChange = new EventEmitter<{ month: number, year: number }>();
  @Output() export = new EventEmitter<void>();

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();

  applyFilter(): void {
    this.filterChange.emit({
      month: this.selectedMonth,
      year: this.selectedYear
    });
  }

  exportData(): void {
    this.export.emit();
  }
}