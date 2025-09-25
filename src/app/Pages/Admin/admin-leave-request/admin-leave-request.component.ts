import { Component } from '@angular/core';
import { ManagerService } from '../../../Core/Services/Manager/manager.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-admin-leave-request',
  standalone: true,
  imports: [
    TableModule,
    CardModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    ProgressSpinnerModule,
    InputTextModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './admin-leave-request.component.html',
  styleUrl: './admin-leave-request.component.css'
})
export class AdminLeaveRequestComponent {
  leaveRequests: any[] = [];
  filteredLeaveRequests: any[] = [];
  isLoading: boolean = false;

  searchTerm: string = '';


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
  ) {}

  ngOnInit() {
    this.getAllPendingLeaves();
  }

  getAllPendingLeaves(): void {
    this.isLoading = true;
    this.leaveService.getAllPendingLeaves().subscribe({
      next: (data: any) => {
        console.log("data ", data);
        this.leaveRequests = data.filter((item: any) => item.employeeRole == 'Manager');
        console.log("this.leaveRequests 123 ", this.leaveRequests);
      this.leaveRequests = [...this.leaveRequests];
      },
      error: (error: any) => {
        this.leaveRequests = [];
        this.filteredLeaveRequests = [];
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

  filterLeavesByName() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredLeaveRequests = this.leaveRequests.filter(request =>
      (`${request.firstName} ${request.lastName}`).toLowerCase().includes(term)
    );
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

  // submitAction() {
  //   if (!this.reason.trim()) {
  //     alert('Please enter a reason.');
  //     return;
  //   }

  //   if (this.actionType === 'approve') {
  //     this.approveLeave(this.selectedRequest, this.reason);
  //   } else if (this.actionType === 'reject') {
  //     this.rejectLeave(this.selectedRequest, this.reason);
  //   }

  //   this.displayDialog = false;
  // }
submitAction() {
  if (!this.reason.trim()) {
    alert('Please enter a reason.');
    return;
  }

  if (this.actionType === 'approve') {
    this.approveLeave(this.selectedRequest.leaveId, this.reason);  // ✅ Fix here
  } else if (this.actionType === 'reject') {
    this.rejectLeave(this.selectedRequest.leaveId, this.reason);  // ✅ Fix here
  }

  this.displayDialog = false;
}

  approveLeave(leaveId:string, reason: string) {
    
    this.leaveService.approveLeave(leaveId,reason).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Leave Approved Successfully',
      });
      this.getAllPendingLeaves();
    });
  }

  rejectLeave(leaveId:string, reason: string) {
    
    this.leaveService.rejectLeave(leaveId,reason).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Leave Rejected Successfully',
      });
      this.getAllPendingLeaves();
    });
  }
}
