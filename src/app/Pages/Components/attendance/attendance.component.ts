import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { AuthService } from '../../../Core/Services/auth.service';
import { ApiService } from '../../../Core/Services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from '../loader/loader.component'; // Import the LoaderComponent
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EmployeeService } from '../../../Core/Services/Employee/employee.service'; 

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    TableModule,
    CommonModule,
    MenubarModule,
    ImageModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    ToastModule,
    LoaderComponent // Include the LoaderComponent here
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [MessageService]
})
export class AttendanceComponent implements OnInit {
  displayPunchInDialog: boolean = false;
  currentTime: string = '';
  attendance_date: string = '';
  Punch_in_time: string | null = null;
  attendanceRecords: any[] = [];
  hasPunchedIn: boolean = false;
  loading: boolean = true;
  attendance: any ;// State to control loader visibility

  constructor(private authService: AuthService, private apiService: ApiService, 
    private employeeService: EmployeeService, private router: Router, private messageService: MessageService,) {}

  ngOnInit(): void {
    this.updateCurrentTime();
    this.loadAttendanceRecords();
    this.checkPunchInStatus();

    this.authService.logoutObservable.subscribe(() => {
      this.checkout();
      sessionStorage.removeItem('hasPunchedIn'); 
    });
  }

  showPunchInDialog() {
    if (!this.hasPunchedIn) {
      this.displayPunchInDialog = true;
      this.updateCurrentTime();
    }
  }

  punchIn() {
    this.Punch_in_time = this.currentTime;
    const attendance_date = new Date();
    debugger
    const newRecord = {
      checkIn: String(this.Punch_in_time), // Ensure it's a string
      date: attendance_date.toLocaleDateString('en-GB'),
      checkOut: '',
      employeeId: this.attendance.empId,
      breaktime: '',
    };
    console.log(newRecord);

    this.attendanceRecords.push(newRecord);
    this.hasPunchedIn = true;
    debugger

    // this.employeeService.markAttendance(newRecord).subscribe(
    //   (response) => {
    //     console.log('Attendance record posted successfully:', response);
    //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully punched in!' });
    //   },
    //   (error) => {
    //     console.error('Error posting attendance record:', error);
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to punch in. Please try again.' });
    //   }
    // );
    this.employeeService.markAttendance({
      employeeId: newRecord.employeeId,
      date: newRecord.date,
      checkIn: newRecord.checkIn,
      checkOut: null,
      breaktime: null
    }).subscribe((data: any) =>  {
      console.log("data", data);
      // this.displayPunchInDialog = false;
      // sessionStorage.setItem('hasPunchedIn', 'true'); 
      // this.router.navigate(['/dashboard']);
    });
    debugger
    
    this.displayPunchInDialog = false;
    sessionStorage.setItem('hasPunchedIn', 'true'); 
    this.router.navigate(['/dashboard']);
    this.saveAttendanceRecords();

  }

  checkout() {
    const Punch_out_time = this.getCurrentTime();
    const lastRecord = this.attendanceRecords[this.attendanceRecords.length - 1];
    if (lastRecord && !lastRecord.checkOut) {
      lastRecord.checkOut = Punch_out_time;
      lastRecord.breaktime = this.calculateBreakTime(lastRecord.checkIn, lastRecord.checkOut);

      this.employeeService.markAttendance(lastRecord).subscribe(
        (response) => {
          console.log('Updated attendance record posted successfully:', response);
        },
        (error) => {
          console.error('Error posting updated attendance record:', error);
        }
      );
      debugger
      this.saveAttendanceRecords();
    } else {
      console.log("Error.");
    }
  }

  updateCurrentTime() {
    const currentDate = new Date();
    this.attendance_date = currentDate.toLocaleDateString('en-GB');
    this.currentTime = currentDate.toLocaleTimeString();
  }

  getCurrentTime() {
    const attendance_date = new Date();
    return attendance_date.toLocaleTimeString();
  }

  calculateBreakTime(checkIn: string, checkOut: string): string {
    const checkInTime = new Date(`01/01/2024 ${checkIn}`);
    const checkOutTime = new Date(`01/01/2024 ${checkOut}`);
    const breakDuration = new Date(checkOutTime.getTime() - checkInTime.getTime());

    const hours = breakDuration.getUTCHours();
    const minutes = breakDuration.getUTCMinutes();
    const seconds = breakDuration.getUTCSeconds();

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  saveAttendanceRecords() {
    localStorage.setItem('attendanceRecords', JSON.stringify(this.attendanceRecords));
  }

  loadAttendanceRecords() {
    this.loading = true;
    this.attendance = JSON.parse(localStorage.getItem("userValue") || "null");
    const savedRecords = localStorage.getItem('attendanceRecords');
  
    if (savedRecords) {
      let parsedRecords = JSON.parse(savedRecords);
  
      // Get today's date in the correct format
      const todayDate = new Date().toLocaleDateString('en-GB');
  
      // Find today's attendance record
      const todayRecord = parsedRecords.find((record: any) => record.date === todayDate);
  
      if (todayRecord) {
        this.hasPunchedIn = true;  // Ensure UI knows that user has punched in today
      }
  
      // Keep only the latest entry for each date
      const uniqueRecordsMap = new Map<string, any>();
      parsedRecords.forEach((record: any) => {
        uniqueRecordsMap.set(record.date, record);
      });
  
      this.attendanceRecords = Array.from(uniqueRecordsMap.values());
    } else {
      console.log("No attendance records found.");
    }
  
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }
  
  
  

  checkPunchInStatus() {
    const hasPunchedInSession = sessionStorage.getItem('hasPunchedIn');
    this.hasPunchedIn = hasPunchedInSession === 'true';

    if (!this.hasPunchedIn) {
      this.showPunchInDialog();
    } else {
      console.log("You have already punched in for this session.");
    }
  }
}
