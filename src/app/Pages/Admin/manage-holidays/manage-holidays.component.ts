import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/Services/api.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Reactive form modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmationService,MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-manage-holidays',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, TableModule, ToastModule,ConfirmDialogModule],
  templateUrl: './manage-holidays.component.html',
  styleUrls: ['./manage-holidays.component.css'],
  providers: [ ConfirmationService,MessageService], // Add MessageService to providers
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
  holidays: any[] = [];
  showHolidayList: boolean = false;
  selectedHolidayId: string | null = null;

  constructor(private apiService: ApiService, private fb: FormBuilder, private messageService: MessageService, 
    private confirmationService: ConfirmationService,) { }

  ngOnInit() {
    // Initialize the reactive form
    this.holidayForm = this.fb.group({
      holidayName: ['', Validators.required],
      holidayDate: ['', Validators.required],
    });
  }

  // Method to add or update a holiday
  onSubmit() {
    // First, we check if the form is valid
    if (this.holidayForm.valid) {
      // Extract the form values (holiday name, date)
      const holiday = this.holidayForm.value;

      // If we're editing an existing holiday (selectedHolidayId is set)
      if (this.selectedHolidayId) {
        // Call the API to update the holiday
        this.apiService.updateHoliday({ ...holiday, id: this.selectedHolidayId }).subscribe(() => {
          // Show success toast
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Holiday updated successfully!' });
          this.clearForm();
          this.getAllHolidaysList();
          this.showHolidayList = true; // Show the holiday list after updating
        });
      } else {
        // If no selectedHolidayId, we are adding a new holiday
        this.apiService.addHoliday(holiday).subscribe(() => {
          // Show success toast
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Holiday added successfully!' });
          this.clearForm();
          this.getAllHolidaysList();
          this.showHolidayList = true; // Show the holiday list after adding
        });
      }
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
  deleteHoliday(id: string, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this holiday?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        // Call the API to delete the holiday
        this.apiService.deleteHoliday(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Holiday deleted successfully!' });
          this.getAllHolidaysList(); // Refresh the holiday list after deletion
          this.showHolidayList = false; // Optionally redirect to another view
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Holiday deletion cancelled!' });
      }
    });
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
}
