import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/Services/api.service';
import { TableModule } from 'primeng/table';
import { Employee } from '../../../Core/Interfaces/employee';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../Components/loader/loader.component';

@Component({
  selector: 'app-all-attendence',
  standalone: true,
  imports: [TableModule, CommonModule, LoaderComponent],  // Add LoaderComponent to imports
  templateUrl: './all-attendence.component.html',
  styleUrls: ['./all-attendence.component.css']
})
export class AllAttendenceComponent implements OnInit {
  record: any[] = [];
  isLoading: boolean = true;  // Loader flag
  currentMonth: number = new Date().getMonth() + 1;  // Current month
  currentYear: number = new Date().getFullYear();  // Current year

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEmployeeRecords();
  }

  loadEmployeeRecords() {
    // Add 1-second loader delay
    setTimeout(() => {
      this.apiService.getEmployees().subscribe(
        (employees: Employee[]) => {
          employees.forEach((employee: Employee) => {
            this.apiService.getAttendanceByEmployee(employee.id, this.currentMonth, this.currentYear).subscribe(
              (attendanceRecords) => {
                const totalDaysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

                const totalAttendance = attendanceRecords.reduce((count: number, record: any) => {
                  const checkInDate = new Date(record.checkIn);
                  if (checkInDate.getMonth() + 1 === this.currentMonth && checkInDate.getFullYear() === this.currentYear) {
                    return count + 1;
                  }
                  return count;
                }, 0);

                const attendanceRatio = `${totalAttendance}/${totalDaysInMonth}`;

                this.apiService.getLeaveRequests().subscribe(
                  (leaveRequests: any[]) => {
                    const employeeLeaves = leaveRequests.filter((request: any) =>
                      request.employeeId === employee.id &&
                      new Date(request.leaveDate).getMonth() + 1 === this.currentMonth &&
                      new Date(request.leaveDate).getFullYear() === this.currentYear
                    ).length;

                    const leavesTaken = employeeLeaves;

                    this.record.push({
                      employeeName: `${employee.firstName} ${employee.lastName}`,
                      employeeRole: employee.role,
                      attendanceRatio: attendanceRatio,
                      leavesTaken: leavesTaken
                    });

                    // Turn off the loader once data is loaded
                    this.isLoading = false;
                  },
                  (error) => {
                    console.error(`Error fetching leave requests for ${employee.firstName}:`, error);
                  }
                );
              },
              (error) => {
                console.error(`Error fetching attendance for ${employee.firstName}:`, error);
              }
            );
          });
        },
        (error) => {
          console.error('Error fetching employees:', error);
        }
      );
    }, 1000);  // Delay of 1 second
  }
}
