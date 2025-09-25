import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EmployeeService } from '../../../Core/Services/Employee/employee.service';
import { AdminService } from '../../../Core/Services/Admin/admin.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-all-attendence',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    PaginatorModule,
    ConfirmDialogModule,
    DialogModule,
    TableModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './all-attendence.component.html',
  styleUrls: ['./all-attendence.component.css']
})
export class AllAttendenceComponent implements OnInit {
  employees: any[] = [];
  departments: any = [];
  roles: any = [];
  employeeForm!: FormGroup;
  showDialog: boolean = false;
  isEditing: boolean = false;
  selectedEmployeeId: number | null = null;
  loading: boolean = false;
  currentDate: string = this.formatDate(new Date());

  attendList: any[] = [];
  fromDate: string = '';
  toDate: string = '';
  allEmployees: any[] = [];
searchEmployee: string = '';

  constructor(
    private employeeService: EmployeeService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadEmployeesAndAttendance();
    this.loadDepartments();
    this.loadRoles();
    this.loadForm();
  }

  /**
   * Load employees and attendance together
   */
  async loadEmployeesAndAttendance() {
    this.loading = true;

    try {
      const [employees, attendanceResponse] = await Promise.all([
        this.employeeService.getEmployees().toPromise(),
        this.employeeService.getAllAttendance().toPromise()
      ]);

      // filter employees (remove admins)
      this.employees = employees.filter((emp: any) => emp.role !== 'Admin');
      this.allEmployees = [...this.employees];

      // normalize attendance list
      this.attendList = attendanceResponse?.data || attendanceResponse || [];
      const today = this.formatDate(new Date());

      // map attendance status into employees
      this.employees.forEach(emp => {
        const attendanceForToday = this.attendList.find((att: any) =>
          att.employeeId === emp.employeeId && att.date === today
        );
        emp.attendanceStatus = attendanceForToday?.checkIn ? "Present" : "Absent";
      });

      this.loading = false;
    } catch (error) {
      console.error('Error loading employees/attendance:', error);
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load employees/attendance data.'
      });
    }
  }

  loadForm() {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      department: ['', [Validators.required]],
      role: ['', [Validators.required]],
      joiningDate: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  /**
   * Export filtered employees with attendance
   */
  downloadFilteredData() {
    const headers = ['First Name', 'Last Name', 'Email', 'Role', 'Joining Date', 'Attendance'];
    const csvRows: string[] = [];
    csvRows.push(headers.join(','));

    this.employees.forEach(emp => {
      const row = [
        emp.firstName || '',
        emp.lastName || '',
        emp.emailId || '',
        emp.role || '',
        emp.joiningDate || '',
        emp.attendanceStatus || ''
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'filtered_attendance.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Filter employees by joining date range
   */
//   filterByDateRange() {
//     if (this.fromDate && this.toDate) {
//       const from = new Date(this.fromDate);
//       const to = new Date(this.toDate);

//       this.employees = this.allEmployees.filter(emp => {
//         const empDate = new Date(emp.joiningDate);
//         return empDate >= from && empDate <= to;
//       });
//     } else {
//       this.employees = [...this.allEmployees];
//     }
//   }

filterByDateRange() {
  let filtered = [...this.attendList]; // start from full attendance list

  // Filter by date range
  if (this.fromDate && this.toDate) {
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    filtered = filtered.filter(att => {
      const attDate = new Date(att.date); // ensure `att.date` is in valid format
      return attDate >= from && attDate <= to;
    });
  }

  // Filter by employee name
  if (this.searchEmployee && this.searchEmployee.trim() !== '') {
    const search = this.searchEmployee.toLowerCase();
    filtered = filtered.filter(att =>
      att.employeeName?.toLowerCase().includes(search)
    );
  }

  this.attendList = filtered;
// 👈 show filtered list
}

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  openDialog() {
    this.showDialog = true;
    this.isEditing = false;
    this.employeeForm.reset();
  }

  loadDepartments() {
    this.adminService.getAllDepartmentsList().subscribe((data) => {
      this.departments = data;
    });
  }

  loadRoles() {
    this.adminService.getAllRolesList().subscribe((data) => {
      this.roles = data;
    });
  }
}
