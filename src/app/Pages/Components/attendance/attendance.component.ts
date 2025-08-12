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
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms'; // <-- Make sure FormsModule is imported in your module
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    CardModule,
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
    ProgressSpinnerModule,
    CalendarModule,
    FormsModule,
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [MessageService]
})
export class AttendanceComponent implements OnInit {
  displayPunchInDialog: boolean = false;
  currentTime: string = '';
  attendance_date: string = '';
  attendanceRecords: any[] = [];
  filteredAttendanceRecords: any[] = [];
  hasPunchedIn: boolean = false;
  loading: boolean = true;
  attendance: any;
  fromDate: Date | null = null;

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
    const punchInTime = this.currentTime;
    const attendanceDate = new Date().toLocaleDateString('en-GB');
    const empId = this.attendance?.empId;

    const existingRecord = this.attendanceRecords.find(
      (record) => record.date === attendanceDate && record.employeeId == empId
    );

    if (!existingRecord) {
      const newRecord = {
        employeeId: empId,
        date: attendanceDate,
        checkIn: punchInTime,
        checkOut: null,
        breaktime: null,
        creationDate: this.getCurrentDateTime(),
        updationDate: null,
        createdBy: 'System',
        modifiedBy: 'System',
        check: 0
      };

      this.hasPunchedIn = true;

      this.employeeService.markAttendance(newRecord).subscribe(
        (response) => {
          console.log("Punch In successful:", response);
          this.loadAttendanceRecords(); 
        },
        (error) => {
          console.error('Error during punch in:', error);
        }
      );

      this.displayPunchInDialog = false;
      sessionStorage.setItem('hasPunchedIn', 'true');
      this.router.navigate(['/dashboard']);
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'You have already punched in today.' });
      this.displayPunchInDialog = false;
    }
  }

  checkout() {
    const checkoutTime = this.getCurrentTime();
    const todayDate = new Date().toLocaleDateString('en-GB');
    const empId = this.attendance?.empId;

    const todayRecord = this.attendanceRecords.find(
      (record) => record.date === todayDate && record.employeeId == empId
    );

    if (todayRecord) {
      if (!todayRecord.checkIn) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cannot Checkout',
          detail: 'You must check in before checkout.'
        });
        return;
      }

      const checkInTime = new Date(`01/01/2024 ${todayRecord.checkIn}`);
      const checkOutTime = new Date(`01/01/2024 ${checkoutTime}`);

      if (checkOutTime <= checkInTime) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Checkout',
          detail: 'Checkout time cannot be earlier than check-in time.'
        });
        return;
      }

      todayRecord.checkOut = checkoutTime;
      todayRecord.breaktime = this.calculateBreakTime(todayRecord.checkIn, todayRecord.checkOut);
      todayRecord.updationDate = this.getCurrentDateTime();

      const updatedRecord = {
        ...todayRecord,
        check: 1 
      };

      this.employeeService.markAttendance(updatedRecord).subscribe(
        (response) => {
          console.log('Checkout updated successfully:', response);
          this.loadAttendanceRecords(); // Refresh data
        },
        (error) => {
          console.error('Error updating checkout:', error);
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

  loadAttendanceRecords() {
    this.loading = true;
    const empId = this.attendance?.empId;

    this.employeeService.getAllAttendance().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          const employeeRecords = response.data.filter((record: any) => record.employeeId == empId);

          this.attendanceRecords = employeeRecords
            .map((record: any) => ({
              date: record.date,      // date format: dd/mm/yyyy expected
              checkIn: record.checkIn,
              checkOut: record.checkOut,
              breaktime: record.breaktime,
              employeeId: record.employeeId
            }))
            .sort((a: any, b: any) => {
              const [dayA, monthA, yearA] = a.date.split('/').map(Number);
              const [dayB, monthB, yearB] = b.date.split('/').map(Number);
              const dateA = new Date(yearA, monthA - 1, dayA);
              const dateB = new Date(yearB, monthB - 1, dayB);
              return dateB.getTime() - dateA.getTime(); // Descending
            });

          // Show all records initially
          this.filteredAttendanceRecords = [...this.attendanceRecords];

          const todayDate = new Date().toLocaleDateString('en-GB');
          const todayRecord = this.attendanceRecords.find((record: any) => record.date === todayDate);
          if (todayRecord && todayRecord.checkIn && !todayRecord.checkOut) {
            this.hasPunchedIn = true;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading attendance records:', error);
        this.loading = false;
      }
    });
  }

  onDateChange() {
    if (!this.fromDate) {
      this.filteredAttendanceRecords = [...this.attendanceRecords];
      return;
    }

    const selectedDateStr = this.formatDateToDDMMYYYY(this.fromDate);

    this.filteredAttendanceRecords = this.attendanceRecords.filter(record => record.date === selectedDateStr);
  }

  clearDateFilter() {
    this.fromDate = null;
    this.filteredAttendanceRecords = [...this.attendanceRecords];
  }

  formatDateToDDMMYYYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
