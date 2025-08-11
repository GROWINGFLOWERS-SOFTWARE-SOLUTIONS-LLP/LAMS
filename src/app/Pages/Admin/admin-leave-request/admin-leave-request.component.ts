import { Component } from '@angular/core';
import { ManagerService } from '../../../Core/Services/Manager/manager.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-admin-leave-request',
  standalone: true,
  imports: [TableModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    ProgressSpinnerModule,
    DialogModule],
  providers: [MessageService],
  templateUrl: './admin-leave-request.component.html',
  styleUrl: './admin-leave-request.component.css'
})
export class AdminLeaveRequestComponent {
  leaveRequests: any[] = []; // Your leave data here
  isLoading: boolean = false; // Show loader if needed


  displayDialog: boolean = false;
  actionType: 'approve' | 'reject' = 'approve';
  selectedRequest: any;
  reason: string = '';


  originalData: any[] = [];
  filterName: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';

 

  constructor(
    private leaveService: ManagerService,
    private messageService: MessageService
  ) { }
  ngOnInit() {

    this.getAllPendingLeaves()
  }

  getAllPendingLeaves(): void {
    this.leaveService.getAllPendingLeaves().subscribe({
      next: (data: any) => {
        // Check if data is valid and the role is not 'Employee'
        console.log("data ", data);
        this.leaveRequests = data.filter((item: any) => item.employeeRole == 'Employee');
        console.log("this.leaveRequests 123 ", this.leaveRequests);
       // this.originalData = data.filter((item: any) => item.employeeRole === 'Employee');
      this.leaveRequests = [...this.leaveRequests];
      },
      error: (error: any) => {
        this.leaveRequests = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
    console.log("this.leaveRequests @@@"+ this.leaveRequests);
  }


  applyFilters(): void {
    this.leaveRequests = this.leaveRequests.filter((item: any) => {
      const nameMatch = !this.filterName || item.firstName.toLowerCase().includes(this.filterName.toLowerCase());
      const startMatch = !this.filterStartDate || new Date(item.startDate) >= new Date(this.filterStartDate);
      const endMatch = !this.filterEndDate || new Date(item.endDate) <= new Date(this.filterEndDate);
      return nameMatch && startMatch && endMatch;
    });
  }
  
  resetFilters(): void {
    this.filterName = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
   // this.leaveRequests = [...this.leaveRequests];
   this.getAllPendingLeaves();
  }

  openDialog(type: 'approve' | 'reject', request: any) {
    this.actionType = type;
    this.selectedRequest = request;
    this.reason = '';
    this.displayDialog = true;
  }

  cancelAction() {
    this.displayDialog = false;
  }

  submitAction() {
    if (!this.reason.trim()) {
      alert('Please enter a reason.');
      return;
    }

    if (this.actionType === 'approve') {
      this.approveLeave(this.selectedRequest, this.reason);
    } else if (this.actionType === 'reject') {
      this.rejectLeave(this.selectedRequest, this.reason);
    }

    this.displayDialog = false;
  }

  approveLeave(request: any, reason: string) {

    request.managerComment = reason;
    console.log('New Request: ', request);

    // TODO: Call your backend API to approve leave with reason
    this.leaveService.approveLeave(request).subscribe((data) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Leave Approve Successfully',
      });

      this.getAllPendingLeaves();
    })
  }

  rejectLeave(request: any, reason: string) {
    console.log('Rejected:', request);
    console.log('Reason:', reason);
    // TODO: Call your backend API to reject leave with reason
    request.managerComment = reason;
    console.log('New Request: ', request);

    // TODO: Call your backend API to approve leave with reason
    this.leaveService.rejectLeave(request).subscribe((data: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Leave Reject Successfully',
      });

      this.getAllPendingLeaves();
    })
  }
}
