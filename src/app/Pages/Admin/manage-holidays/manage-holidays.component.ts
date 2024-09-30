import { Component } from '@angular/core';
import { ApiService } from '../../../Core/Services/api.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-manage-holidays',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonModule, TableModule],
  templateUrl: './manage-holidays.component.html',
  styleUrls: ['./manage-holidays.component.css'],
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
export class ManageHolidaysComponent {
  holidayName: string = '';
  holidayDate: string = '';
  successMessage: string = '';
  holidays: any[] = [];
  showHolidayList: boolean = false;
  selectedHolidayId: string | null = null; // To store the ID of the holiday being edited

  constructor(private apiService: ApiService) {}

  // Method to add a holiday
  addHoliday() {
    const holiday = {
      holidayName: this.holidayName,
      holidayDate: this.holidayDate
    };

    this.apiService.addHoliday(holiday).subscribe(() => {
      this.successMessage = 'Holiday added successfully!';
      this.clearForm();
      this.getAllHolidaysList();
      this.showSuccessMessage();
    });
  }

  // Method to update an existing holiday
  updateHoliday() {
    const holiday = {
      id: this.selectedHolidayId, // Use the selectedHolidayId to identify which holiday to update
      holidayName: this.holidayName,
      holidayDate: this.holidayDate
    };

    this.apiService.updateHoliday(holiday).subscribe(() => {
      this.successMessage = 'Holiday updated successfully!';
      this.clearForm();
      this.getAllHolidaysList();
      this.showSuccessMessage();
    });
  }

  // Method to fetch the list of holidays from the API
  getAllHolidaysList() {
    this.apiService.getHolidaysList().subscribe((data: any[]) => {
      this.holidays = data;
    });
  }

  // Method to toggle the holiday list visibility
  toggleHolidayList() {
    if (!this.showHolidayList) {
      this.getAllHolidaysList(); // Fetch the list of holidays if not already visible
    }
    this.showHolidayList = !this.showHolidayList;
  }

  // Method to delete a holiday with confirmation
  deleteHoliday(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this holiday?');
    if (confirmDelete) {
      this.apiService.deleteHoliday(id).subscribe(() => {
        this.successMessage = 'Holiday deleted successfully!';
        this.getAllHolidaysList(); // Refresh the list after deletion
        this.showSuccessMessage();
      });
    }
  }

  // Method to edit a holiday
  editHoliday(holiday: any) {
    this.holidayName = holiday.holidayName;
    this.holidayDate = holiday.holidayDate;
    this.selectedHolidayId = holiday.id; // Store the ID of the holiday being edited
    this.showHolidayList = false; // Redirect to add holiday form
  }

  // Method to clear the form fields
  clearForm() {
    this.holidayName = '';
    this.holidayDate = '';
    this.selectedHolidayId = null; // Clear the selected holiday ID
  }

  // Method to show success messages
  showSuccessMessage() {
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }
}
