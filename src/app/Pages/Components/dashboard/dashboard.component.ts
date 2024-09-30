import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../../Core/Services/api.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit{

  totalEmployees: number = 0;
  remainingLeaves: number = 0;
  totalAttendance: number = 0;
  absent: number = 0;
  leavesTaken: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {

// Total Employee
    this.apiService.getEmployee().subscribe(employee => {
    this.totalEmployees = employee.length;
    });
// Remaining Leaves 
    this.apiService.getLeaves().subscribe((leaves) => {
    this.remainingLeaves = leaves.length;
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
// Leaves taken
    this.apiService.getLeavesTaken().subscribe((leavesTaken) => {
    this.leavesTaken = leavesTaken.length;
    }
    );
  }
}
