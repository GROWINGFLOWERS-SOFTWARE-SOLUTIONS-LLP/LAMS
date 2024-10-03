import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/Services/api.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Reactive form modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-manage-holidays',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, TableModule],
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
export class ManageHolidaysComponent implements OnInit {
  holidayForm!: FormGroup; // Reactive Form Group
  successMessage: string = '';
  holidays: any[] = [];
  showHolidayList: boolean = false;
  selectedHolidayId: string | null = null;

  constructor(private apiService: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    // Initialize the reactive form
    this.holidayForm = this.fb.group({
      holidayName: ['', Validators.required],
      holidayDate: ['', Validators.required],
    });
  }

  // Method to add or update a holiday
  onSubmit() {
    if (this.holidayForm.invalid) {
      return;
    }

    const holiday = this.holidayForm.value;

    if (this.selectedHolidayId) {
      // Update holiday
      this.apiService.updateHoliday({ ...holiday, id: this.selectedHolidayId }).subscribe(() => {
        this.successMessage = 'Holiday updated successfully!';
        this.clearForm();
        this.getAllHolidaysList();
        this.showHolidayList = true; // Show the holiday list after updating
        this.showSuccessMessage();
      });
    } else {
      // Add new holiday
      this.apiService.addHoliday(holiday).subscribe(() => {
        this.successMessage = 'Holiday added successfully!';
        this.clearForm();
        this.getAllHolidaysList();
        this.showHolidayList = true; // Show the holiday list after adding
        this.showSuccessMessage();
      });
    }
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
        this.showHolidayList = false; // Redirect to "Add Holiday" page after deletion
        this.showSuccessMessage();
      });
    }
  }

  // Method to edit a holiday
  editHoliday(holiday: any) {
    this.holidayForm.patchValue({
      holidayName: holiday.holidayName,
      holidayDate: holiday.holidayDate
    });
    this.selectedHolidayId = holiday.id; // Store the ID of the holiday being edited
    this.showHolidayList = false; // Optionally redirect to the form
  }

  // Method to clear the form fields
  clearForm() {
    this.holidayForm.reset();
    this.selectedHolidayId = null;
  }

  // Method to show success messages
  showSuccessMessage() {
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }
}
