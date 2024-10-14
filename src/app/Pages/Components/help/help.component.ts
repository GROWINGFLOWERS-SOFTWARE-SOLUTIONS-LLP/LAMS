import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CardModule, AccordionModule, ButtonModule, ToastModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  providers: [MessageService],
})
export class HelpComponent {
  isTabOpen: boolean[] = [false, false, false, false, false];

  constructor(private messageService: MessageService) {}

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


