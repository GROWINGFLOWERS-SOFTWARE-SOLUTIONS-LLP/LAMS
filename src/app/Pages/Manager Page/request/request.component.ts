import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ManagerService } from '../../../Core/Services/Manager/manager.service';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../Core/Services/auth.service';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    CommonModule,
    ProgressSpinnerModule,
    CardModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  leaveRequests: any[] = []; // Your leave data here
  isLoading: boolean = false; // Show loader if needed
  filteredLeaveRequests: any[] = [];
  searchTerm: string = '';
  displayDialog: boolean = false;
  actionType: 'approve' | 'reject' = 'approve';
  selectedRequest: any;
  reason: string = '';
  managerName: string = '';

  constructor(
    private leaveService: ManagerService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }


  ngOnInit() {
    const user = this.authService.getLoggedInUser();

    if (user && user.role === 'Manager') {
      const managerName = `${user.firstName} ${user.lastName}`;
      this.getManagerLeaves(managerName);
    }
  }

  getManagerLeaves(managerName: string): void {
    console.log(managerName);
    
    this.isLoading = true;
    this.leaveService.getManagerLeaves(managerName).subscribe({
      next: (data: any[]) => {
        this.leaveRequests = data.filter(l => l.status === 'PENDING');
        this.filteredLeaveRequests = [...this.leaveRequests];
      },
      error: () => {
        this.leaveRequests = [];
        this.filteredLeaveRequests = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }



  // getAllPendingLeaves(): void {
  //   this.leaveService.getAllPendingLeaves().subscribe({
  //     next: (data: any) => {
  //       this.leaveRequests = data.filter((item:any) => item.employeeRole !== 'Manager');
  //     },
  //     error: (error: any) => {
  //       this.leaveRequests = [];
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //     }
  //   });
  // }

  // getAllPendingLeaves(): void {
  //   this.isLoading = true;
  //   this.leaveService.getAllPendingLeaves().subscribe({
  //     next: (data: any) => {
  //       this.leaveRequests = data.filter((item: any) => item.employeeRole !== 'Manager');
  //       this.filterLeaveRequestsByName(); // Immediately apply filtering on load
  //     },
  //     error: (error: any) => {
  //       this.leaveRequests = [];
  //       this.filteredLeaveRequests = [];
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //     }
  //   });
  // }


  filterLeaveRequestsByName(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      this.filteredLeaveRequests = this.leaveRequests.filter(request => {
        const fullName = `${request.firstName ?? ''} ${request.lastName ?? ''}`.toLowerCase();
        return fullName.includes(term);
      });
    } else {
      this.filteredLeaveRequests = [...this.leaveRequests];
    }
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

  //   submitAction() {
  //   if (this.actionType === 'approve') {
  //    this.approveLeave(this.selectedRequest.leaveId,this.reason);
  //   } else if (this.actionType === 'reject') {
  //     this.rejectLeave(this.selectedRequest.leaveId,this.reason);
  //   }
  // }

  submitAction() {
    if (!this.reason.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please enter a reason.'
      });
      return;
    }

    if (this.actionType === 'approve') {
      this.approveLeave(this.selectedRequest.leaveId, this.reason);
    } else if (this.actionType === 'reject') {
      this.rejectLeave(this.selectedRequest.leaveId, this.reason);
    }
  }

  //   approveLeave(leaveId: string, reason: string) {
  //     console.log('LeaveId:', leaveId);
  //     console.log('Reason:', reason);
  //     this.leaveService.approveLeave(leaveId,reason).subscribe((data) => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Leave Approve Successfully',
  //       });

  //       this.getAllPendingLeaves();
  //     })
  //   }

  // rejectLeave(leaveId: string, reason: string) {
  //     this.leaveService.rejectLeave(leaveId, reason).subscribe({
  //       next: () => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Success',
  //           detail: 'Leave Rejected Successfully',
  //         });
  //         this.getAllPendingLeaves();
  //       },
  //       error: () => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Failed to reject leave',
  //         });
  //       }
  //     });
  //   }

  approveLeave(leaveId: string, reason: string) {
    const managerName = this.authService.getUserFullName();
    this.leaveService.approveLeave(leaveId, reason).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Leave Approved Successfully',
        });
        this.displayDialog = false; // 👈 close dialog
        this.reason = '';           // reset reason
        this.getManagerLeaves(managerName);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to approve leave',
        });
      }
    });
  }

  rejectLeave(leaveId: string, reason: string) {
    const managerName = this.authService.getUserFullName();
    this.leaveService.rejectLeave(leaveId, reason).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Leave Rejected Successfully',
        });
        this.displayDialog = false; // 👈 close dialog
        this.reason = '';           // reset reason
        this.getManagerLeaves(managerName);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to reject leave',
        });
      }
    });
  }

}
