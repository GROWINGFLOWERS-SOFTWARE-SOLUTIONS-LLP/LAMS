import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common'; // Required for *ngIf
import { LoaderComponent } from '../loader/loader.component'; // Import the LoaderComponent

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CardModule, AccordionModule, ButtonModule, ToastModule, CommonModule, LoaderComponent],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  providers: [MessageService],
})
export class HelpComponent {
  isTabOpen: boolean[] = [false, false, false, false, false];
  loading: boolean = true; // Initialize loading state
  apiService: any;
  helpData: any;

  constructor(private messageService: MessageService) {
    this.simulateLoading(); // Simulate loading for demo purposes
  }

  simulateLoading() {
      this.loading = false; // Hide loader after 2 seconds
  }

  onTabSelect(event: boolean, index: number) {
    this.isTabOpen[index] = event;
  }

  copyEmail() {
    navigator.clipboard.writeText('contact@growing-flowers-softwaresolutions.com');
    this.showSuccess();
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Email address copied to clipboard!',
    });
  }
}
