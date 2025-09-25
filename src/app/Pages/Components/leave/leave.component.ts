import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Leave } from '../../../Core/Interfaces/leave';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ManagerService } from '../../../Core/Services/Manager/manager.service';
import { EmployeeService } from '../../../Core/Services/Employee/employee.service';

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
    TableModule,
    ToastModule,
    ProgressSpinnerModule
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
  showPaginator: boolean = false;
  employee: any;
 managers: any[] = [];

  leaveTypes = [
    { label: 'Sick Leave', value: 'Sick Leave' },
    { label: 'Paid Leave', value: 'Paid Leave' },
    { label: 'Unpaid Leave', value: 'Unpaid Leave' },
    { label: 'Casual Leave', value: 'Casual Leave' }
  ];

  constructor(
    private leaveService: ManagerService,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.employee = JSON.parse(localStorage.getItem("userValue") || "null");
    this.initLeaveForm();
    this.loadLeaveRequests();
    this.loadManagers(); 
  }

initLeaveForm(): void {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      reason: ['', Validators.required],
      totalLeaves: [{ value: 0, disabled: true }],
      totalLeavesTaken: [''],
      employeeLeaveId: [this.employee?.empId],
      firstName: [this.employee?.firstName],
      lastName: [this.employee?.lastName],  
      employeeRole: [this.employee?.role],
         managerName: this.employee?.role === 'Employee' ? ['', Validators.required] : ['']
    });


    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateTotalLeaves());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateTotalLeaves());
  }

   loadManagers(): void {
    this.employeeService.getManagers().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          // Assuming your API returns [{ empId, firstName, lastName }]
          this.managers = data.map((m: any) => ({
            label: `${m.firstName} ${m.lastName}`,
             value: `${m.firstName} ${m.lastName}`
          }));
        }
      },
      error: (err) => {
        console.error('Error loading managers:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load managers.'
        });
      }
    });
  }

  loadLeaveRequests(): void {
    this.isLoading = true;
    this.showPaginator = false;

    this.leaveService.getEmployeeLeaves(this.employee.empId).subscribe({
      next: (data: any) => {
        this.leaveRequests = data;
        this.isLoading = false;
        this.showPaginator = true;
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load leave requests.' });
      }
    });
  }

  showDialog(): void {
    this.resetLeaveRequestForm(); // Clear form before opening
    this.visible = true;
  }

  saveLeaveRequest(): void {
    if (this.leaveForm.valid) {
      const leaveRequest: Leave = this.leaveForm.getRawValue();
      leaveRequest.status = 'PENDING';

      this.leaveService.applyLeave(leaveRequest).subscribe({
        next: (data) => {
          if (data) {
            this.loadLeaveRequests();
            this.visible = false;
            this.resetLeaveRequestForm();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leave request saved successfully.' });
          }
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit leave request.' });
        }
      });
    } else {
      this.leaveForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill out all required fields.' });
    }
  }

  calculateTotalLeaves(): void {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;
    const totalLeavesTaken = this.leaveForm.get('totalLeavesTaken')?.value;
  
    // Check if both startDate and endDate are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      // Ensure the endDate is after the startDate
      if (end < start) {
        this.leaveForm.get('totalLeaves')?.setValue(0); // Or show an error message if needed
        return;
      }
  
      const diffInMs = end.getTime() - start.getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;
      const totalLeaves = diffInDays > 0 ? diffInDays : 0;
  
      // Update totalLeaves in the form
      this.leaveForm.get('totalLeaves')?.setValue(totalLeaves);
      console.log('loadLeave: ', this.leaveRequests);

      let updatedTotalLeavesTaken:any = "0";
      
      if (Array.isArray(this.leaveRequests) && this.leaveRequests.length > 0) {
        const total = this.leaveRequests.reduce((acc: number, leave: any) => {
          const taken = Number(leave.totalLeavesTaken) || 0;
          const current = Number(leave.totalLeaves) || 0;
          console.log( "current: ", current, 'taken: ', taken, 'Total Leaves; ',totalLeaves );
          return  taken + totalLeaves;
        }, 0);
        updatedTotalLeavesTaken = total.toString();
      } 
      else {
        updatedTotalLeavesTaken = totalLeaves;
      }

      console.log('updatedTotalLeavesTaken: ', updatedTotalLeavesTaken.toString());
     
      this.leaveForm.get('totalLeavesTaken')?.setValue(updatedTotalLeavesTaken.toString());
    }
  }
 

  resetLeaveRequestForm(): void {
    this.leaveForm.reset({
      leaveType: '',
      startDate: null,
      endDate: null,
      reason: '',
      totalLeaves: 0,
      employeeLeaveId: this.employee?.empId,
      firstName: this.employee?.firstName,
      lastName: this.employee?.lastName,
      employeeRole: this.employee?.role
    });
  }

  // Delete API
   deleteLeave(leaveId: string): void {
    if (!leaveId) return;

    this.leaveService.deleteLeave(leaveId).subscribe({
      next: (res) => {
        console.log('Deleted:', res);

        // ✅ Optionally show a success message
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Leave request cancelled successfully'
        });

        this.loadLeaveRequests();
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to cancel leave'
        });
      }
    });
  }
}