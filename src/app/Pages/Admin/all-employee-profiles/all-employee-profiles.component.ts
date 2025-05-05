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



@Component({
    selector: 'app-all-employee-profiles',
    templateUrl: './all-employee-profiles.component.html',
    styleUrls: ['./all-employee-profiles.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, ButtonModule, PaginatorModule,
        ConfirmDialogModule, DialogModule, TableModule, CalendarModule, InputTextModule, DropdownModule, ToastModule, ProgressSpinnerModule], // Add ProgressSpinnerModule here
    providers: [MessageService, ConfirmationService]
})
export class AllEmployeeProfilesComponent implements OnInit {
    employees: any = [];
    departments: any = [];
    managers: any = [];
    roles: any = [];
    employeeForm!: FormGroup;
    showDialog: boolean = false;
    isEditing: boolean = false;
    selectedEmployeeId: number | null = null;
    loading: boolean = false;
    setPassword: any;

    constructor(
        private employeeService: EmployeeService,
        private adminService: AdminService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {

    }

    ngOnInit(): void {
        this.loadForm()
        this.loadEmployees();
        this.loadDepartments();
        this.loadManagers();
        this.loadRoles();
    }


    loadForm() {
        // Create the employee form
        this.employeeForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            emailId: ['', [Validators.required, Validators.email]],
            mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            department: ['', [Validators.required]],
            role: ['', [Validators.required]],
            manager: ['', [Validators.required]],
            joiningDate: ['', [Validators.required]],
            address: ['', [Validators.required]]
        });
    }

    loadEmployees() {
        debugger
        this.loading = true; // Set loading to true
        this.employeeService.getEmployees().subscribe((data) => {
            debugger
            this.employees = data;
            console.log('All Employee; ', this.employees)
            this.loading = false; // Set loading to false when data is loaded
        }, (error) => {
            console.error('Error loading employees:', error);
            this.loading = false; // Set loading to false on error
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load employee data.' });
        });

    }


    openDialog() {
        this.showDialog = true;
        this.isEditing = false;
        this.employeeForm.reset();
    }

    addEmployee() {
        debugger;
        if (this.employeeForm.valid) {
            debugger;
            let employeeForm = { ...this.employeeForm.value, password: 'Gfss@2024' }
            debugger;
            this.employeeService.addEmployee(employeeForm).subscribe({
                next: () => {
                    debugger;
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
        debugger;
        this.employeeForm.patchValue(employee);
        this.setPassword = employee.password
        this.isEditing = true;
        this.showDialog = true;
        this.selectedEmployeeId = employee.empId;
    }

    updateEmployee() {
        if (this.employeeForm.valid) {
            debugger;
            const employeeData = { ...this.employeeForm.value, employeeId: this.selectedEmployeeId, password: this.setPassword };
            debugger;
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

    // Method to confirm deletion with an alert
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
                this.performDelete(); // Call the method to perform the delete
            },
            reject: () => {
                // Show cancellation message using p-toast
                this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Deletion canceled.' });
            }
        });
    }

    // Method to perform the delete operation
    performDelete() {
        if (this.selectedEmployeeId !== null) {
            this.employeeService.deleteEmployee(this.selectedEmployeeId).subscribe({
                next: () => {
                    this.loadEmployees(); // Reload employees after successful deletion
                    // Show success message using p-toast
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Employee deleted successfully.' });
                },
                error: (err) => {
                    console.error('Error deleting employee:', err);
                    // Show error message using p-toast
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete employee. Please try again.' });
                }
            });
        }
        this.selectedEmployeeId = null; // Reset the selected ID
    }

    isFieldInvalid(field: string): boolean {
        const control = this.employeeForm.get(field);
        return control ? control.invalid && (control.touched || control.dirty) : false;
    }

    loadDepartments() {
        this.adminService.getAllDepartmentsList().subscribe((data:any) => {
            this.departments = data.data;
        })
    }

    loadManagers(){
        this.adminService.getAllManagersList().subscribe((data:any) =>{
            this.managers = data.data;
        })
    }
    loadRoles(){
        this.adminService.getAllRolesList().subscribe((data:any) =>{
            this.roles = data.data;
        })
    }
}
