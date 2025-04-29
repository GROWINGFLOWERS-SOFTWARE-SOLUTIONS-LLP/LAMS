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
import { LoaderComponent } from '../loader/loader.component';
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
    LoaderComponent,
    ProgressSpinnerModule
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
  attendance: any;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.updateCurrentTime();
    this.attendance = JSON.parse(localStorage.getItem("userValue") || "null");
    this.loadAttendanceRecords();
    this.checkPunchInStatus();

    this.authService.logoutObservable.subscribe(() => {
      this.checkout();
      sessionStorage.removeItem('hasPunchedIn');
    });
  }

  updateCurrentTime() {
    const currentDate = new Date();
    this.attendance_date = currentDate.toLocaleDateString('en-GB');
    this.currentTime = currentDate.toLocaleTimeString();
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString();
  }

  getCurrentDateTime(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.toTimeString().split(' ')[0]}`;
  }

  showPunchInDialog() {
    if (!this.hasPunchedIn) {
      this.displayPunchInDialog = true;
      this.updateCurrentTime();
    }
  }

  punchIn() {
    this.Punch_in_time = this.currentTime;
    const attendance_date = new Date().toLocaleDateString('en-GB');
    const empId = this.attendance?.empId;

    const existingRecord = this.attendanceRecords.find(
      (record) => record.date === attendance_date && record.employeeId === empId
    );

    if (!existingRecord) {
      const newRecord = {
        checkIn: this.Punch_in_time,
        date: attendance_date,
        checkOut: '',
        employeeId: empId,
        breaktime: '',
        creationDate: this.getCurrentDateTime(),
        updationDate: '',
        createdBy: 'System',
        modifiedBy: 'System'
      };

      this.attendanceRecords.push(newRecord);
      this.hasPunchedIn = true;

      this.employeeService.markAttendance({
        employeeId: newRecord.employeeId,
        date: newRecord.date,
        checkIn: newRecord.checkIn,
        checkOut: null,
        breaktime: null,
        creationDate: newRecord.creationDate,
        updationDate: null,
        createdBy: 'System',
        modifiedBy: 'System',
        check: 0
      }).subscribe((data) => {
        console.log("Attendance record posted successfully:", data);
      });

      this.displayPunchInDialog = false;
      sessionStorage.setItem('hasPunchedIn', 'true');
      this.saveAttendanceRecords();
      this.router.navigate(['/dashboard']);
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'You have already punched in today.' });
      this.displayPunchInDialog = false;

    }
  }

  checkout() {
    const Punch_out_time = this.getCurrentTime();
    const todayDate = new Date().toLocaleDateString('en-GB');
    const empId = this.attendance?.empId;

    const todayRecordIndex = this.attendanceRecords.findIndex(
      (record) => record.date === todayDate && record.employeeId === empId
    );

    if (todayRecordIndex !== -1) {
      const todayRecord = this.attendanceRecords[todayRecordIndex];

      const checkInTime = new Date(`01/01/2024 ${todayRecord.checkIn}`);
      const checkOutTime = new Date(`01/01/2024 ${Punch_out_time}`);

      if (checkOutTime <= checkInTime) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Checkout',
          detail: 'Checkout time cannot be earlier than check-in time.'
        });
        return;
      }

      todayRecord.checkOut = Punch_out_time;
      todayRecord.breaktime = this.calculateBreakTime(todayRecord.checkIn, todayRecord.checkOut);
      todayRecord.updationDate = this.getCurrentDateTime();

      this.attendanceRecords[todayRecordIndex] = todayRecord;
      this.saveAttendanceRecords();

      this.employeeService.markAttendance({
        employeeId: empId,
        date: todayRecord.date,
        checkIn: todayRecord.checkIn,
        checkOut: todayRecord.checkOut,
        breaktime: todayRecord.breaktime,
        creationDate: todayRecord.creationDate,
        updationDate: todayRecord.updationDate,
        createdBy: 'System',
        modifiedBy: 'System',
        check: 1
      }).subscribe(
        (response) => {
          console.log('Updated attendance record posted successfully:', response);
        },
        (error) => {
          console.error('Error posting updated attendance record:', error);
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Check-in Found',
        detail: 'You haven’t checked in today.'
      });
    }
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
    const savedRecords = localStorage.getItem('attendanceRecords');
  
    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords);
      const empId = this.attendance?.empId;
  
      // Filter only logged-in employee's data
      const employeeRecords = parsedRecords.filter((record: any) => record.employeeId === empId);
  
      const todayDate = new Date().toLocaleDateString('en-GB');
      const todayRecord = employeeRecords.find(
        (record: any) => record.date === todayDate
      );
  
      if (todayRecord) {
        this.hasPunchedIn = true;
      }
  
      // Optional: remove duplicate entries (same date & empId)
      const uniqueRecordsMap = new Map<string, any>();
      employeeRecords.forEach((record: any) => {
        const key = `${record.date}-${record.employeeId}`;
        if (!uniqueRecordsMap.has(key)) {
          uniqueRecordsMap.set(key, record);
        }
      });
  
      this.attendanceRecords = Array.from(uniqueRecordsMap.values());
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
