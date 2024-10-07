import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/Services/api.service';
import { TableModule } from 'primeng/table';
import { Employee } from '../../../Core/Interfaces/employee';

@Component({
  selector: 'app-all-attendence',
  standalone: true,
  imports: [TableModule],
  templateUrl: './all-attendence.component.html',
  styleUrls: ['./all-attendence.component.css']
})
export class AllAttendenceComponent implements OnInit {
  record: any[] = [];
  currentMonth: number = new Date().getMonth() + 1; // Current month
  currentYear: number = new Date().getFullYear(); // Current year

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEmployeeRecords();
  }

  loadEmployeeRecords() {
    // Fetch employees from the API
    this.apiService.getEmployees().subscribe(
      (employees: Employee[]) => { // Use Employee type here
        employees.forEach((employee: Employee) => { // Add type here
          // Fetch attendance for each employee
          this.apiService.getAttendanceByEmployee(employee.id, this.currentMonth, this.currentYear).subscribe(
            (attendanceRecords) => {
              const totalDaysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

              // Count total attendance records for the current month
              const totalAttendance = attendanceRecords.reduce((count: number, record: any) => {
                const checkInDate = new Date(record.checkIn);
                // Check if the record is in the current month and year
                if (checkInDate.getMonth() + 1 === this.currentMonth && checkInDate.getFullYear() === this.currentYear) {
                  return count + 1; // Increment count for each record
                }
                return count;
              }, 0);

              // Set attendance ratio as total attendance / total days in the month
              const attendanceRatio = `${totalAttendance}/${totalDaysInMonth}`;

              // Fetch leave data
              this.apiService.getLeaveRequests().subscribe(
                (leaveRequests: any[]) => {
                  const employeeLeaves = leaveRequests.filter((request: any) =>
                    request.employeeId === employee.id &&
                    new Date(request.leaveDate).getMonth() + 1 === this.currentMonth &&
                    new Date(request.leaveDate).getFullYear() === this.currentYear
                  ).length;

                  const leavesTaken = employeeLeaves;

                  // Push the employee record into the array
                  this.record.push({
                    employeeName: `${employee.firstName} ${employee.lastName}`,
                    employeeRole: employee.role,
                    attendanceRatio: attendanceRatio,
                    leavesTaken: leavesTaken
                  });
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
  }
}
