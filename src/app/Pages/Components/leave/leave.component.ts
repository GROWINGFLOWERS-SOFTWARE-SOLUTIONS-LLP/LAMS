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
import { Leave } from '../../../Core/Interfaces/leave';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    TableModule,
    ToastModule,
    ProgressSpinnerModule, LoaderComponent
  ],
  providers: [MessageService],
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
  visible: boolean = false;
  today: Date = new Date();
  leaveForm!: FormGroup;
  leaveRequests: Leave[] = [];
  isLoading: boolean = true;
  showPaginator: boolean = false; // Control paginator visibility

  leaveTypes = [
    { label: 'Sick Leave', value: 'Sick Leave' },
    { label: 'Paid Leave', value: 'Paid Leave' },
    { label: 'Unpaid Leave', value: 'Unpaid Leave' }
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initLeaveForm();
    this.loadLeaveRequests();
  }

  initLeaveForm(): void {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      reason: ['', Validators.required],
      totalLeaves: [{ value: 0, disabled: true }]
    });

    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateTotalLeaves());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateTotalLeaves());
  }

  loadLeaveRequests(): void {
    this.isLoading = true;
    this.showPaginator = false; // Hide paginator initially

    setTimeout(() => {
      this.apiService.getLeaveRequests().subscribe(
        (data: Leave[]) => {
          this.leaveRequests = data;
          this.isLoading = false;
          this.showPaginator = true; // Show paginator after loading data
        },
        (error) => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load leave requests.' });
        }
      );
    }, 3000);
  }

  showDialog(): void {
    this.visible = true;
  }

  saveLeaveRequest(): void {
    if (this.leaveForm.valid) {
      const leaveRequest: Leave = this.leaveForm.getRawValue();  // Get form values including disabled fields
      leaveRequest.status = 'Pending';  // Set status to "Pending"
 
      // Send leave request to the API
      this.apiService.submitLeaveRequest(leaveRequest).subscribe(() => {
        this.leaveRequests.push({ ...leaveRequest });  // Add the new leave request to the list
        this.resetLeaveRequestForm();  // Reset the form
        this.visible = false;  // Hide the dialog
 
        // Show success toast
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leave request saved successfully.' });
      });
    } else {
      this.leaveForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill out all required fields.' });
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