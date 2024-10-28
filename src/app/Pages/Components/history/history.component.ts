import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';  // Import reusable LoaderComponent

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, LoaderComponent],  // Import LoaderComponent
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  loading: boolean = true;  // Initial loader state

  constructor() {
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      this.loading = false; 
    }, 1000);  // Simulate 1 second delay
  }
}
