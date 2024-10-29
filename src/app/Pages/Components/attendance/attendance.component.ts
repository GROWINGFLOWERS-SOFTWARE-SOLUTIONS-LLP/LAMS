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
  loading: boolean = true; // State to control loader visibility

  constructor(private authService: AuthService, private apiService: ApiService, private router: Router, private messageService: MessageService,) {}

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
    const newRecord = {
      date: attendance_date.toLocaleDateString('en-GB'),
      checkIn: this.Punch_in_time,
      checkOut: '',
      break: ''
    };

    this.attendanceRecords.push(newRecord);
    this.hasPunchedIn = true;
   
    this.apiService.postAttendance(newRecord).subscribe(
      (response) => {
        console.log('Attendance record posted successfully:', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully punched in!' });
      },
      (error) => {
        console.error('Error posting attendance record:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to punch in. Please try again.' });
      }
    );

    this.saveAttendanceRecords();
    this.displayPunchInDialog = false;
    sessionStorage.setItem('hasPunchedIn', 'true'); 
    this.router.navigate(['/dashboard']);
    
  }

  checkout() {
    const Punch_out_time = this.getCurrentTime();
    const lastRecord = this.attendanceRecords[this.attendanceRecords.length - 1];
    if (lastRecord && !lastRecord.checkOut) {
      lastRecord.checkOut = Punch_out_time;
      lastRecord.break = this.calculateBreakTime(lastRecord.checkIn, lastRecord.checkOut);

      this.apiService.postAttendance(lastRecord).subscribe(
        (response) => {
          console.log('Updated attendance record posted successfully:', response);
        },
        (error) => {
          console.error('Error posting updated attendance record:', error);
        }
      );

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
    this.loading = true; // Show loader when loading starts
    const savedRecords = localStorage.getItem('attendanceRecords');
    if (savedRecords) {
      this.attendanceRecords = JSON.parse(savedRecords);
    } else {
      console.log("Failed.");
    }

    // Set a timeout to hide the loader after 2 seconds
    setTimeout(() => {
      this.loading = false; // Hide loader when loading completes
    }, 2000); // 2000 milliseconds = 2 seconds
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
