import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderComponent } from '../../Components/loader/loader.component';

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
  leaveRequests = [
    {
      employeeName: 'Prajakta Badhan',
      employeeRole: 'Software Engineer',
      leaveRequest: 'Annual Leave',
      leaveReason: 'Family Vacation',
      totalLeaves: 20,
      leavesTaken: 6,
      startDate: new Date(2024, 8, 15),
      endDate: new Date(2024, 8, 20),
      status: 'Pending'
    },
    {
      employeeName: 'Bhushan Malpure',
      employeeRole: 'Developer',
      leaveRequest: 'Sick Leave',
      leaveReason: 'Medical emergency',
      totalLeaves: 20,
      leavesTaken: 6,
      startDate: new Date(2024, 8, 10),
      endDate: new Date(2024, 8, 12),
      status: 'Pending'
    }
  ];

  isLoading = true;  // Manage loading state

  ngOnInit() {
    // Simulate loading for 1 second
    setTimeout(() => {
      this.isLoading = false;  // Stop loader after 1 second
    }, 1000);
  }

  approveLeave(request: any) {
    console.log('Leave approved for:', request.employeeName);
    request.status = 'Approved';
    // Add logic for leave approval, such as calling an API to update the status
  }

  rejectLeave(request: any) {
    console.log('Leave rejected for:', request.employeeName);
    request.status = 'Rejected';
    // Add logic for leave rejection, such as calling an API to update the status
  }
}
