import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/Services/api.service';
import { TableModule } from 'primeng/table';
 
@Component({
  selector: 'app-all-attendence',
  standalone: true,
  imports: [TableModule],
  templateUrl: './all-attendence.component.html',
  styleUrl: './all-attendence.component.css'
})
export class AllAttendenceComponent  implements OnInit {
  record: any[] = [];
  currentMonth: number = new Date().getMonth() + 1; // Current month
  currentYear: number = new Date().getFullYear(); // Current year

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAttendanceRecords();
  }

  loadAttendanceRecords() {
    const employees = [
      { employeeId: '1', employeeName: 'Sahil Mhatre', employeeRole: 'Software Engineer' },
      { employeeId: '2', employeeName: 'Prajakta Badhan', employeeRole: 'Software Engineer' },
      { employeeId: '3', employeeName: 'Bhushan', employeeRole: 'Software Engineer' }
    ];

    employees.forEach(employee => {
      // Fetch attendance records
      this.apiService.getAttendanceByEmployee(employee.employeeId, this.currentMonth, this.currentYear).subscribe(
        (attendanceRecords) => {
          const totalDaysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
          const daysPresent = attendanceRecords.filter(record => record.checkIn).length; // Count days with check-in
          const attendanceRatio = `${daysPresent}/${totalDaysInMonth}`;

          // Fetch leave requests for the employee
          this.apiService.getLeaveRequests().subscribe(
            (leaveRequests: any[]) => { // Specify leaveRequests as an array of any
              // Filter leaves for this employee in the current month
              const employeeLeaves = leaveRequests.filter((request: any) => // Specify request as any
                request.employeeId === employee.employeeId &&
                new Date(request.leaveDate).getMonth() + 1 === this.currentMonth &&
                new Date(request.leaveDate).getFullYear() === this.currentYear
              ).length;

              const leavesTaken = employeeLeaves;

              // Add the attendance and leave data to the record array
              this.record.push({
                employeeName: employee.employeeName,
                employeeRole: employee.employeeRole,
                attendanceRatio: attendanceRatio,
                leavesTaken: leavesTaken
              });
            },
            (error) => {
              console.error(`Error fetching leave requests for ${employee.employeeName}:`, error);
            }
          );
        },
        (error) => {
          console.error(`Error fetching attendance for ${employee.employeeName}:`, error);
        }
      );
    });
  }
}
  // record = [
  //   {
  //     employeeName: 'Sahil Mhatre',
  //     employeeRole: 'Software Engineer',
  //     attendanceRatio : '30/30',
  //     leavestaken : '5'
  //   },
  //   {
  //     employeeName: 'Prajakta Badhan',
  //     employeeRole: 'Software Engineer',
  //     attendanceRatio : '28/30',
  //     leavestaken : '2'
     
  //   },
  //   {
  //     employeeName: 'Bhushan',
  //     employeeRole: 'Software Engineer',
  //     attendanceRatio : '02/30',
  //     leavestaken : '16'
     
  //   },]
  // attendanceRecords: any[] = [];
 
 
  // constructor(private apiService: ApiService) {}
  // }
//   ngOnInit(): void {
//     this.loadAttendanceRecords();
//   }
 
//   loadAttendanceRecords() {
//     this.apiService.getAttendanceRecords().subscribe(
//       (records: any[]) => {
//         this.attendanceRecords = records.map(record => ({
//           employeeName: record.date,
//           employeeRole: record.employeeRole,
//           attendanceRatio: this.calculateAttendanceRatio(record.attendance)
//         }));
//       },
//       (error) => {
//         console.error('Error loading attendance records:', error);
//       }
//     );
//   }
//   calculateAttendanceRatio(attendance: any[]): string {
//     const totalDaysInMonth = 30; // Adjust based on the specific month
//     const attendedDays = attendance.length; // Assuming each record is for a day
//     return `${attendedDays}/${totalDaysInMonth}`;
//   }
// }