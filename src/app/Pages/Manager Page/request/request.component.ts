import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ManagerService } from '../../../Core/Services/Manager/manager.service';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  leaveRequests: any = [];

  isLoading = true;
  
  constructor(
    private leaveService: ManagerService
  ) { }

  ngOnInit() {

    this.getAllPendingLeaves()
  }

  getAllPendingLeaves(): void {
    this.leaveService.getAllPendingLeaves().subscribe({
      next: (data: any) => {
        // Check if data is valid and the role is not 'Manager'
        this.leaveRequests = data.filter((item:any) => item.employeeRole !== 'Manager');
      },
      error: (error) => {
        
        this.leaveRequests = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  

  approveLeave(request: any) {
    if (request.employeeLeaveId) {
      this.leaveService.approveLeave(request.leaveId).subscribe((data) => {
        this.getAllPendingLeaves();
      })
    }
  }

  rejectLeave(request: any) {
    if (request.employeeLeaveId) {
      this.leaveService.rejectLeave(request.leaveId).subscribe((data) => {
        this.getAllPendingLeaves();
      })
    }
  }
}
