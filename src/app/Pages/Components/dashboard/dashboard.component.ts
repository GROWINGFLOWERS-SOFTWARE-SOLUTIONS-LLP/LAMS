import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MeterGroupModule } from 'primeng/metergroup';
import { ApiService } from '../../../Core/Services/api.service';
import { BadgeModule } from 'primeng/badge';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule,MeterGroupModule,BadgeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  totalEmployees: number = 0;
  pendingLeaves: number = 0;
  totalAttendance: number = 0;
  absent: number = 0;

  constructor(private apiService: ApiService) {}

  totalEmp: any[] = [];
  leaveSummary = [
    { color:'#34d399'},
    { color:'#fbbf24'},
    
];
   attendanceSummary = [
    { label: 'Total Attendance', color:'#60a5fa', value: 97 },
    { label: 'Absent', color: '#34d399', value: 0 },
    
];

ngOnInit(): void {
  // Total Employee
  this.apiService.getEmployee().subscribe(employee => {
    this.totalEmployees = employee.length;
    console.log(this.totalEmployees)
  });
// Pending Leaves 
  this.apiService.getLeaves().subscribe((leaves) => {
      this.pendingLeaves = leaves.length;
    }
  );
// Total Attendace
  this.apiService.getAttendance().subscribe((attendance) => {
    this.totalAttendance = attendance.length;
  }
);
// Total Absent
this.apiService.getAbsent().subscribe((absent) => {
  this.absent = absent.length;
}
);
}
}
