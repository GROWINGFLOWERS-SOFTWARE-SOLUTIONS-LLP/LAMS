import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Import ProgressSpinnerModule
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common'; // Required for *ngIf

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CardModule, AccordionModule, ButtonModule, ToastModule, ProgressSpinnerModule, CommonModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  providers: [MessageService],
})
export class HelpComponent {
  isTabOpen: boolean[] = [false, false, false, false, false];
  loading: boolean = true; // Initialize loading state

  constructor(private messageService: MessageService) {
    this.simulateLoading(); // Simulate loading for demo purposes
  }

  simulateLoading() {
    setTimeout(() => {
      this.loading = false; // Hide loader after 2 seconds
    }, 1000); // Adjust time as needed
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
