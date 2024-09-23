import { Component } from '@angular/core';
import { ApiService } from '../../../Core/Services/api.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-manage-holidays',
  standalone: true,
  imports: [FormsModule, CommonModule,ButtonModule],
  templateUrl: './manage-holidays.component.html',
  styleUrls: ['./manage-holidays.component.css'], // Fixed typo here
  animations: [
    trigger('fadeInOut', [
      transition('hidden => visible', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition('visible => hidden', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ManageHolidaysComponent  {
  holidayName: string = '';
  holidayDate: string = '';
  successMessage: string = '';
 
  constructor(private apiService: ApiService) {}
 
  addHoliday() {
    const holiday = {
      holidayName: this.holidayName,
      holidayDate: this.holidayDate
    };
 
    this.apiService.addHoliday(holiday).subscribe(() => {
      this.successMessage = 'Holiday added successfully!';  // Set success message
      this.holidayName = '';
      this.holidayDate = '';
      setTimeout(() => {
        this.successMessage = '';
      }, 50000);
    });
  }
}