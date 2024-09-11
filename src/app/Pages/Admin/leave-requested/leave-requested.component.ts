import { Component } from '@angular/core'; // Core Angular component functionality
import { MenuItem } from 'primeng/api';    // For PrimeNG MenuItem (optional if using Menubar, etc.)
import { ConfirmationService } from 'primeng/api';  // For confirmation dialog on approval/rejection (optional)
import { MessageService } from 'primeng/api';       // For displaying success/error messages (optional)
import { TableModule } from 'primeng/table';        // PrimeNG table module
import { ButtonModule } from 'primeng/button';      // PrimeNG button module
import { FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-leave-requested',
  standalone: true,
  imports: [TableModule,ButtonModule,FormsModule],
  templateUrl: './leave-requested.component.html',
  styleUrl: './leave-requested.component.css'
})
export class LeaveRequestedComponent {

  leaveRequests = [
    {
      employeeName: 'John Doe',
      employeeRole: 'Software Engineer',
      leaveRequest: 'Annual Leave',
      leaveReason: 'Family Vacation',
      startDate: new Date(2024, 8, 15),
      endDate: new Date(2024, 8, 20)
    },
    {
      employeeName: 'Jane Smith',
      employeeRole: 'Product Manager',
      leaveRequest: 'Sick Leave',
      leaveReason: 'Medical emergency',
      startDate: new Date(2024, 8, 10),
      endDate: new Date(2024, 8, 12)
    }
  ];

  approveLeave(request: any) {
    console.log('Leave approved for:', request.employeeName);
    // Add logic for leave approval
  }

  rejectLeave(request: any) {
    console.log('Leave rejected for:', request.employeeName);
    // Add logic for leave rejection
  }
}