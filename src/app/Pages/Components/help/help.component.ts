import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CardModule, AccordionModule, ButtonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {

  isTabOpen: boolean[] = [false, false, false, false, false];

  onTabSelect(event: boolean, index: number) {
    this.isTabOpen[index] = event;
  }

  copyEmail() {
    navigator.clipboard.writeText('contact@growing-flowers-softwaresolutions.com');
    alert('Email address copied to clipboard!');
  }

}
