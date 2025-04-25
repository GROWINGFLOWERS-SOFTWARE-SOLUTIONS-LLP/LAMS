import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderComponent } from '../../Components/loader/loader.component';
import { ManagerService } from '../../../Core/Services/Manager/manager.service';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    ProgressSpinnerModule,
    LoaderComponent  // Register the loader component
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
        console.error('Error fetching leave data:', error);
        this.leaveRequests = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  

  approveLeave(request: any) {
    console.log('Leave approved for:', request);
    debugger;
    if (request.employeeLeaveId) {
      this.leaveService.approveLeave(request.leaveId).subscribe((data) => {
        console.log('Approve Leave: ', data);
        this.getAllPendingLeaves();
      })
    }


  }

  rejectLeave(request: any) {
    console.log('Leave rejected for:', request);
    if (request.employeeLeaveId) {
      this.leaveService.rejectLeave(request.leaveId).subscribe((data) => {
        console.log('Reject Leave: ', data);
        this.getAllPendingLeaves();
      })
    }
  }
}
