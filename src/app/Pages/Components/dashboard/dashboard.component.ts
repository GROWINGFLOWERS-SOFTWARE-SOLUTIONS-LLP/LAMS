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
  
  totalEmployees!: number;
  totalLeaves!:number; 
  remainingLeaves!: number;
  totalAttendance!: number;
  absent!: number;
  leavesTaken!: number;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {


    // Total Employee
    this.apiService.getEmployee().subscribe(employee => {
    this.totalEmployees = employee.length;
    });

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

    // Remaining Leaves
    this.apiService.getLeavedata().subscribe((Leavedata:any) => {
    this.totalLeaves = Leavedata.totalLeaves;
    this.leavesTaken = Leavedata.leavesTaken;
    this.calculateRemainingLeaves();
    });
  }
    calculateRemainingLeaves(){
    this.remainingLeaves = this.totalLeaves -this.leavesTaken;
}
}
