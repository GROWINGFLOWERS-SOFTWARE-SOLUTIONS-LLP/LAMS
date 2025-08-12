import { Component, OnInit } from '@angular/core';
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
import { EmployeeService } from '../../../Core/Services/Employee/employee.service';
import { AdminService } from '../../../Core/Services/Admin/admin.service';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-all-employee-profiles',
    templateUrl: './all-employee-profiles.component.html',
    styleUrls: ['./all-employee-profiles.component.css'],
    standalone: true,
    imports: [
        ReactiveFormsModule, CommonModule, ButtonModule, PaginatorModule, CardModule,
        ConfirmDialogModule, DialogModule, TableModule, CalendarModule, InputTextModule,
        DropdownModule, ToastModule, ProgressSpinnerModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class AllEmployeeProfilesComponent implements OnInit {
    employees: any[] = [];
    filteredEmployees: any[] = [];
    departments: any[] = [];
    managers: any[] = [];
    roles: any[] = [];
    employeeForm!: FormGroup;
    showDialog: boolean = false;
    isEditing: boolean = false;
    selectedEmployeeId: number | null = null;
    loading: boolean = false;
    setPassword: any;
    searchTerm: string = '';

    constructor(
        private employeeService: EmployeeService,
        private adminService: AdminService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit(): void {
        this.loadForm();
        this.loadEmployees();
        this.loadDepartments();
        this.loadRoles();
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
            address: ['', [Validators.required]]
        });
    }

    loadEmployees() {
        this.loading = true;
        this.employeeService.getEmployees().subscribe({
            next: (data) => {
                this.employees = data;
                this.filteredEmployees = [...data]; // clone for filtering
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading employees:', error);
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load employee data.' });
            }
        });
    }

    filterEmployeesByName() {
        const search = this.searchTerm.trim().toLowerCase();
        if (!search) {
            this.filteredEmployees = [...this.employees];
        } else {
            this.filteredEmployees = this.employees.filter(emp =>
                (`${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search))
            );
        }
    }

    openDialog() {
        this.showDialog = true;
        this.isEditing = false;
        this.employeeForm.reset();
    }

    addEmployee() {
        if (this.employeeForm.valid) {
            const employeeForm = { ...this.employeeForm.value, password: 'Gfss@2024' };
            this.employeeService.addEmployee(employeeForm).subscribe({
                next: () => {
                    this.loadEmployees();
                    this.showDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee added successfully.' });
                },
                error: (err) => {
                    console.error('Error adding employee:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add employee. Please try again.' });
                }
            });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill out the form correctly.' });
        }
    }

    editEmployee(employee: any) {
        this.employeeForm.patchValue(employee);
        this.setPassword = employee.password;
        this.isEditing = true;
        this.showDialog = true;
        this.selectedEmployeeId = employee.empId;
    }

    updateEmployee() {
        if (this.employeeForm.valid) {
            const employeeData = {
                ...this.employeeForm.value,
                employeeId: this.selectedEmployeeId,
                password: this.setPassword
            };
            this.employeeService.updateEmployee(employeeData).subscribe({
                next: () => {
                    this.loadEmployees();
                    this.showDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee updated successfully.' });
                },
                error: (err) => {
                    console.error('Error updating employee:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update employee. Please try again.' });
                }
            });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill out the form correctly.' });
        }
    }

    deleteEmployee(employee: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this employee?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "p-button-danger p-button-text",
            rejectButtonStyleClass: "p-button-text",
            acceptIcon: "none",
            rejectIcon: "none",
            accept: () => {
                this.selectedEmployeeId = employee.empId;
                this.performDelete();
            },
            reject: () => {
                this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Deletion canceled.' });
            }
        });
    }

    performDelete() {
        if (this.selectedEmployeeId !== null) {
            this.employeeService.deleteEmployee(this.selectedEmployeeId).subscribe({
                next: () => {
                    this.loadEmployees();
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Employee deleted successfully.' });
                },
                error: (err) => {
                    console.error('Error deleting employee:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete employee. Please try again.' });
                }
            });
        }
        this.selectedEmployeeId = null;
    }

    isFieldInvalid(field: string): boolean {
        const control = this.employeeForm.get(field);
        return control ? control.invalid && (control.touched || control.dirty) : false;
    }

    loadDepartments() {
        this.adminService.getAllDepartmentsList().subscribe((data: any) => {
            this.departments = data.data;
        });
    }

    loadManagers() {
        this.adminService.getAllManagersList().subscribe((data: any) => {
            this.managers = data.data;
        });
    }

    loadRoles() {
        this.adminService.getAllRolesList().subscribe((data: any) => {
            this.roles = data.data;
        });
    }
}
