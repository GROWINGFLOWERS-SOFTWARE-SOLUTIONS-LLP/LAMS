import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/Services/api.service';
import { TableModule } from 'primeng/table';
<<<<<<< HEAD

=======
 
>>>>>>> 938312788694c0be44154956fc6e5aea73a6d096
@Component({
  selector: 'app-all-attendence',
  standalone: true,
  imports: [TableModule],
  templateUrl: './all-attendence.component.html',
  styleUrl: './all-attendence.component.css'
})
export class AllAttendenceComponent  {
  record = [
    {
      employeeName: 'Sahil Mhatre',
      employeeRole: 'Software Engineer',
      attendanceRatio : '30/30',
      leavestaken : '5'
    },
    {
      employeeName: 'Prajakta Badhan',
      employeeRole: 'Software Engineer',
      attendanceRatio : '28/30',
      leavestaken : '2'
<<<<<<< HEAD
      
=======
     
>>>>>>> 938312788694c0be44154956fc6e5aea73a6d096
    },
    {
      employeeName: 'Bhushan',
      employeeRole: 'Software Engineer',
      attendanceRatio : '02/30',
      leavestaken : '16'
<<<<<<< HEAD
      
    },]
  attendanceRecords: any[] = [];
  

=======
     
    },]
  attendanceRecords: any[] = [];
 
 
>>>>>>> 938312788694c0be44154956fc6e5aea73a6d096
  constructor(private apiService: ApiService) {}
  }
//   ngOnInit(): void {
//     this.loadAttendanceRecords();
//   }
<<<<<<< HEAD

=======
 
>>>>>>> 938312788694c0be44154956fc6e5aea73a6d096
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