import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../../Core/Services/api.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, CommonModule, LoaderComponent],  // Add LoaderComponent here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loggedInUserName!: string;

  totalEmployees!: number;
  totalLeaves!: number;
  remainingLeaves!: number;
  totalAttendance!: number;
  absent!: number;
  leavesTaken!: number;

  isLoading = true;  // Variable to control the loader

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Show loader for 2 seconds
    setTimeout(() => {
      this.isLoading = false;  // Hide loader after 2 seconds
    }, 1000);

    this.loadTotalEmployees();
    this.loadTotalAttendance();
    this.loadTotalAbsent();
    this.loadLeaveData();

    // Fetch the logged-in user's name from apiService
    const loggedInUser = this.apiService.getLoggedInUser();
    if (loggedInUser) {
      this.loggedInUserName =
        loggedInUser.firstName + ' ' + loggedInUser.lastName;
    }
  }

  // Method to calculate total employees
  private loadTotalEmployees(): void {
    this.apiService.getEmployee().subscribe((employee) => {
      this.totalEmployees = employee.length;
    });
  }

  // Method to calculate total attendance
  private loadTotalAttendance(): void {
    this.apiService.getAttendance().subscribe((attendance) => {
      this.totalAttendance = attendance.length;
    });
  }

  // Method to calculate total absent
  private loadTotalAbsent(): void {
    this.apiService.getAbsent().subscribe((absent) => {
      this.absent = absent.length;
    });
  }

  // Method to calculate leave data
  private loadLeaveData(): void {
    this.apiService.getLeavedata().subscribe((Leavedata: any) => {
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
