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

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [DialogModule, ButtonModule, TableModule, CommonModule, MenubarModule, ImageModule, BadgeModule, AvatarModule, InputTextModule, RippleModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  displayPunchInDialog: boolean = false;
  currentTime: string = '';
  attendance_date: string = '';
  Punch_in_time: string | null = null;
  attendanceRecords: any[] = [];
  hasPunchedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.updateCurrentTime();
    this.loadAttendanceRecords();
    this.checkPunchInStatus();

    // Subscribe to the logout observable from AuthService
    this.authService.logoutObservable.subscribe(() => {
      this.checkout();
      sessionStorage.removeItem('hasPunchedIn'); // Clear session storage on logout
    });
  }

  showPunchInDialog() {
    if (!this.hasPunchedIn) {
      this.displayPunchInDialog = true;
      this.updateCurrentTime();
      sessionStorage.setItem('hasPunchedIn', 'true'); // Set session storage flag
    }
  }

  punchIn() {
    this.Punch_in_time = this.currentTime;
    const attendance_date = new Date();
    const newRecord = {
      date: attendance_date.toLocaleDateString(),
      checkIn: this.Punch_in_time,
      checkOut: '',
      break: ''
    };
    this.attendanceRecords.push(newRecord);
    this.hasPunchedIn = true;
    this.saveAttendanceRecords();
    this.displayPunchInDialog = false;
    this.router.navigate(['/dashboard']);
  }

  checkout() {
    const Punch_out_time = this.getCurrentTime();
    const lastRecord = this.attendanceRecords[this.attendanceRecords.length - 1];
    if (lastRecord && !lastRecord.checkOut) {
      lastRecord.checkOut = Punch_out_time;
      lastRecord.break = this.calculateBreakTime(lastRecord.checkIn, lastRecord.checkOut);
      this.saveAttendanceRecords();
    }
  }

  updateCurrentTime() {
    const currentDate = new Date();
    this.attendance_date = currentDate.toDateString();
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
    const savedRecords = localStorage.getItem('attendanceRecords');
    if (savedRecords) {
      this.attendanceRecords = JSON.parse(savedRecords);
    }
  }

  checkPunchInStatus() {
    const hasPunchedInSession = sessionStorage.getItem('hasPunchedIn');
    this.hasPunchedIn = hasPunchedInSession === 'true';
    if (!this.hasPunchedIn) {
      this.showPunchInDialog();
    }
  }
}
