import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CardModule, AccordionModule, ButtonModule, ToastModule, CommonModule],
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
  faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to your profile, click on "Change Password", and follow the instructions.',
      expanded: false
    },
    {
      question: 'How can I request leave?',
      answer: 'Click on the Leave menu, then fill out and submit the leave form.',
      expanded: false
    },
    {
      question: 'Who can I contact for technical support?',
      answer: 'You can reach out to your system administrator or contact IT support via the Helpdesk.',
      expanded: false
    }
  ];

  toggleFaq(faq: any) {
    faq.expanded = !faq.expanded;
  }
}
