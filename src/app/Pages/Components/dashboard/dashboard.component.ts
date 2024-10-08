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
  totalLeaves!: number; 
  remainingLeaves!: number;
  totalAttendance!: number;
  absent!: number;
  leavesTaken!: number;
 
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {

    this.loadTotalEmployees();
    this.loadTotalAttendance();
    this.loadTotalAbsent();
    this.loadLeaveData();
    }
  
    private loadTotalEmployees(): void {
      this.apiService.getEmployee().subscribe(employee => {
      this.totalEmployees = employee.length;
      });
      }

    private loadTotalAttendance(): void {
      this.apiService.getAttendance().subscribe((attendance) => {
      this.totalAttendance = attendance.length;
      });
      }

    private loadTotalAbsent(): void {
      this.apiService.getAbsent().subscribe((absent) => {
      this.absent = absent.length;
      });
      }

    private loadLeaveData(): void {
      this.apiService.getLeavedata().subscribe((Leavedata:any) => {
      this.totalLeaves = Leavedata.totalLeaves;
      this.leavesTaken = Leavedata.leavesTaken;
      this.calculateRemainingLeaves();  // Calculate remaining leaves after fetching data
      });
      }

    // Method to calculate remaining leaves
    private calculateRemainingLeaves(): void {
      this.remainingLeaves = this.totalLeaves - this.leavesTaken;  // Calculate remaining leaves
  }
}