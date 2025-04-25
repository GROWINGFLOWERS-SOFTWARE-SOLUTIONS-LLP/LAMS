import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { LoaderComponent } from '../../Components/loader/loader.component';
import { EmployeeService } from '../../../Core/Services/Employee/employee.service';
import { AdminService } from '../../../Core/Services/Admin/admin.service';


@Component({
    selector: 'app-all-attendence',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        ButtonModule,
        PaginatorModule,
        LoaderComponent,
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
    employees: any = [];
    departments: any = [];
    roles: any = [];
    employeeForm!: FormGroup;
    showDialog: boolean = false;
    isEditing: boolean = false;
    selectedEmployeeId: number | null = null;
    loading: boolean = false;

    constructor(
        private employeeService: EmployeeService,
        private adminService: AdminService,
        private formBuilder: FormBuilder,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadEmployees();
        this.loadDepartments();
        this.loadRoles();
        this.loadForm();
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

    loadEmployees() {
        this.loading = true;
        this.employeeService.getEmployees().subscribe({
            next: (data) => {
                this.employees = data.filter((emp: any) => emp.role !== 'Admin');
                const attendancePromises = this.employees.map((emp: any) =>
                    this.checkAttendanceStatus(emp.empId).then(status => {
                        emp.attendanceStatus = status;
                    })
                );
                Promise.all(attendancePromises).then(() => {
                    this.loading = false;
                });
            },
            error: (error) => {
                console.error('Error loading employees:', error);
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load employee data.'
                });
            }
        });
    }

    async checkAttendanceStatus(employeeId: number): Promise<string> {
        return new Promise((resolve) => {
            this.employeeService.getAllAttendanceEmployee().subscribe({
                next: (response: any) => {
                    const allAttendance = response?.data || [];
                    const today = this.formatDate(new Date());

                    const attendanceForEmployeeToday = allAttendance.find((att: any) => {
                        const attId = att.employeeId;
                        const currentId = BigInt(employeeId).toString();
                        const attDate = att.date;

                        return attId === currentId && attDate === today;
                    });

                    if (attendanceForEmployeeToday?.checkIn) {
                        resolve("Present");
                    } else {
                        resolve("Absent");
                    }
                },
                error: (err) => {
                    resolve("Absent");
                }
            });
        });
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

