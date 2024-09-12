import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../../Core/Services/api.service';
import { Router } from '@angular/router';

interface LeaveRequest {
  leaveType: string;
  startDate: Date;
  endDate: Date;
  status: string;
  reason?: string;
  totalLeaves: number;
}

@Component({ 
  selector: 'app-leave',
  standalone: true,
  imports:  [
    CommonModule,
    FormsModule,
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
  visible: boolean = false;
  leaveRequests: LeaveRequest[] = [];
  leaveRequest: LeaveRequest = {
    leaveType: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'Pending', // Default status
    reason: '',
    totalLeaves: 0
  };

  leaveTypes = [
    { label: 'Sick Leave', value: 'Sick Leave' },
    { label: 'Paid Leave', value: 'Paid Leave' },
    { label: 'Unpaid Leave', value: 'Unpaid Leave' }
  ];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  loadLeaveRequests(): void {
    this.apiService.getLeaveRequests().subscribe((data: LeaveRequest[]) => {
      this.leaveRequests = data;
    });
  }

  showDialog(): void {
    this.visible = true;
  }

  saveLeaveRequest(): void {
    if (this.isFormValid()) {
      this.leaveRequest.status = 'Pending'; // Ensure status is set to "Pending"
      this.apiService.submitLeaveRequest(this.leaveRequest).subscribe(() => {
        this.leaveRequests.push({ ...this.leaveRequest });
        this.leaveRequest = {
          leaveType: '',
          startDate: new Date(),
          endDate: new Date(),
          status: 'Pending', // Default status
          reason: '',
          totalLeaves: 0
        };
        this.visible = false;
      });
    }
  }

  isFormValid(): boolean {
    return this.leaveRequest.leaveType.trim() !== '' &&
           !!this.leaveRequest.startDate &&
           !!this.leaveRequest.endDate &&
           this.leaveRequest.totalLeaves > 0;
  }
}
