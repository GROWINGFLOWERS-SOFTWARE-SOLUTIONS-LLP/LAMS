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
    selectedEmployeeId: String | null = null;
    loading: boolean = false;
    setPassword: any;
    searchTerm: string = '';
    showManagerDropdown: boolean = false;  // <-- add this

    constructor(
        private employeeService: EmployeeService,
        private adminService: AdminService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) { }

    ngOnInit(): void {
        this.loadForm();
        this.loadEmployees();
        this.loadDepartments();
        this.loadRoles();
        this.loadManagers();

        // ✅ Watch role changes
        this.employeeForm.get('role')?.valueChanges.subscribe(role => {
            this.showManagerDropdown = role?.toLowerCase() === 'employee';
            if (!this.showManagerDropdown) {
                this.employeeForm.get('manager')?.reset();
            }
        });
    }



    loadForm() {
        this.employeeForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            emailId: ['', [Validators.required, Validators.email]],
            mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            department: ['', [Validators.required]],
            role: ['', [Validators.required]],
            manager: [''],
            joiningDate: ['', [Validators.required]],
            address: ['', [Validators.required]]
        });
    }

    managersMap: { [id: string]: string } = {};

    loadManagers() {
        this.employeeService.getManagers().subscribe((data: any) => {
            this.managers = data.map((mgr: any) => ({
                label: mgr.firstName + ' ' + mgr.lastName,
                value: mgr.firstName + ' ' + mgr.lastName   // stored value (manager name)

            }));

            // Create a quick lookup map: { employeeId -> fullName }
            this.managersMap = {};
            data.forEach((mgr: any) => {

                this.managersMap[mgr.firstName + ' ' + mgr.lastName] = mgr.firstName + ' ' + mgr.lastName;
            });
        });
    }


    loadEmployees() {
        this.loading = true;
        this.employeeService.getEmployees().subscribe({
            next: (data) => {
                this.employees = data;
                console.log("Employees",data );
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

    // editEmployee(employee: any) {

    //     this.employeeForm.patchValue(employee);
    //     this.setPassword = employee.password;
    //     this.isEditing = true;
    //     this.showDialog = true;
    //     this.selectedEmployeeId = employee.empId;
    // }

    editEmployee(employee: any) {
        this.employeeForm.patchValue({
            firstName: employee.firstName,
            lastName: employee.lastName,
            emailId: employee.emailId,
            mobile: employee.mobile,
            department: employee.department,
            role: employee.role,
            manager: employee.manager,
            joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '', // format date for input
            address: employee.address
        });

        this.setPassword = employee.password;
        this.isEditing = true;
        this.showDialog = true;

        // ✅ use correct field from API
        this.selectedEmployeeId = employee.empId;
    }


    // updateEmployee() {
    //     if (this.employeeForm.valid) {
    //         const employeeData = {
    //             ...this.employeeForm.value,
    //             employeeId: this.selectedEmployeeId,
    //             password: this.setPassword
    //         };
    //         this.employeeService.updateEmployee(employeeData).subscribe({
    //             next: () => {
    //                 this.loadEmployees();
    //                 this.showDialog = false;
    //                 this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee updated successfully.' });
    //             },
    //             error: (err) => {
    //                 console.error('Error updating employee:', err);
    //                 this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update employee. Please try again.' });
    //             }
    //         });
    //     } else {
    //         this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill out the form correctly.' });
    //     }
    // }

    updateEmployee() {
        if (this.employeeForm.valid) {
            const employeeData = {
                ...this.employeeForm.value,
                empId: this.selectedEmployeeId,  // must match backend model
                password: this.setPassword
            };

            console.log('Patched form values:', this.employeeForm.value);
            console.log('Update payload:', employeeData);


            this.employeeService.updateEmployee(employeeData.empId,employeeData).subscribe({
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
            acceptButtonStyleClass: "p-button-success p-button-text",
            rejectButtonStyleClass: "p-button-danger p-button-text",
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



    loadRoles() {
        this.adminService.getAllRolesList().subscribe((data: any) => {
            this.roles = data.data;
        });
    }
}
