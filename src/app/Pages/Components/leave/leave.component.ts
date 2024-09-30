import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../../Core/Services/api.service';
import { Router } from '@angular/router';
import { Leave } from '../../../Core/Interfaces/leave'; // Importing the Leave interface

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Using ReactiveFormsModule
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    TableModule
  ],
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
  visible: boolean = false;  // Control visibility of the dialog
  today: Date = new Date();  // Current date for form validation
  leaveForm!: FormGroup;  // Reactive form group
  leaveRequests: Leave[] = [];  // Array to store leave requests using the Leave interface

  // Leave types options for the dropdown
  leaveTypes = [
    { label: 'Sick Leave', value: 'Sick Leave' },
    { label: 'Paid Leave', value: 'Paid Leave' },
    { label: 'Unpaid Leave', value: 'Unpaid Leave' }
  ];

  // Injecting required services
  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initLeaveForm();  // Initialize the form
    this.loadLeaveRequests();  // Load existing leave requests from the API
  }

  // Initialize the reactive form
  initLeaveForm(): void {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      reason: [''],  // Optional field
      totalLeaves: [{ value: 0, disabled: true }]  // Total leaves field is disabled and calculated automatically
    });

    // Listen to changes in start and end date to calculate total leaves dynamically
    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateTotalLeaves());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateTotalLeaves());
  }

  // Load leave requests from the API
  loadLeaveRequests(): void {
    this.apiService.getLeaveRequests().subscribe((data: Leave[]) => {
      this.leaveRequests = data;
    });
  }

  // Show the leave request dialog
  showDialog(): void {
    this.visible = true;
  }

  // Save the leave request and send it to the API
  saveLeaveRequest(): void {
    if (this.leaveForm.valid) {
      const leaveRequest: Leave = this.leaveForm.getRawValue();  // Get form values including disabled fields
      leaveRequest.status = 'Pending';  // Set status to "Pending"

      // Send leave request to the API
      this.apiService.submitLeaveRequest(leaveRequest).subscribe(() => {
        this.leaveRequests.push({ ...leaveRequest });  // Add the new leave request to the list
        this.resetLeaveRequestForm();  // Reset the form
        this.visible = false;  // Hide the dialog
      });
    }
  }

  // Calculate the total number of leave days based on the start and end dates
  calculateTotalLeaves(): void {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (startDate && endDate) {
      const diffInMs = new Date(endDate).getTime() - new Date(startDate).getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;  // Include both start and end date
      const totalLeaves = diffInDays > 0 ? diffInDays : 0;
      this.leaveForm.get('totalLeaves')?.setValue(totalLeaves);  // Update total leaves
    } else {
      this.leaveForm.get('totalLeaves')?.setValue(0);  // Reset total leaves if dates are invalid
    }
  }

  // Reset the form after a leave request is saved or cancelled
  resetLeaveRequestForm(): void {
    this.leaveForm.reset({
      leaveType: '',
      startDate: null,
      endDate: null,
      reason: '',
      totalLeaves: 0
    });
  }
}
