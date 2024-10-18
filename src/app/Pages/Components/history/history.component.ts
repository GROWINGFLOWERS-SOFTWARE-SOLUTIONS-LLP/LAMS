import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Import PrimeNG ProgressSpinner

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule], // Import required modules
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  loading: boolean = true; // Initial loader state

  constructor() {
    // Simulate data loading
    this.loadData();
  }

  loadData() {
    
    setTimeout(() => {
      this.loading = false; 
    }, 1000); // 2 seconds delay 
  }
}
