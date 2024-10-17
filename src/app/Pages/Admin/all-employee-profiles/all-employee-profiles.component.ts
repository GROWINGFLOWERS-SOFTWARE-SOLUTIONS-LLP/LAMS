import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../Core/Services/api.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';  // Import ToastModule
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';


@Component({
    selector: 'app-all-employee-profiles',
    templateUrl: './all-employee-profiles.component.html',
    styleUrls: ['./all-employee-profiles.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, ButtonModule, PaginatorModule, ConfirmDialogModule, DialogModule, TableModule, CalendarModule, InputTextModule, DropdownModule, ToastModule], // Add ToastModule here
    providers: [MessageService, ConfirmationService] // Add MessageService here
})
export class AllEmployeeProfilesComponent implements OnInit {
    employees: any[] = [];
    employeeForm: FormGroup;
    showDialog: boolean = false;
    isEditing: boolean = false;
    selectedEmployeeId: number | null = null;

    constructor(
        private apiService: ApiService,
        private formBuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService ,// Inject MessageService
        private confirmationService: ConfirmationService,  
    ) {
        // Create the employee form
        this.employeeForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            department: ['', Validators.required],
            manager: ['', Validators.required],
            role: ['', Validators.required],
            joiningDate: ['', Validators.required],
            address: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.loadEmployees();
    }

    loadEmployees() {
        this.apiService.getEmployees().subscribe((data) => {
            this.employees = data;
        });
    }

    openDialog() {
        this.showDialog = true;
        this.isEditing = false;
        this.employeeForm.reset();
    }

    addEmployee() {
        if (this.employeeForm.valid) {
            this.apiService.addEmployee(this.employeeForm.value).subscribe({
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
        this.isEditing = true;
        this.showDialog = true;
        this.selectedEmployeeId = employee.id;
    }

    updateEmployee() {
        if (this.employeeForm.valid) {
            const employeeData = { ...this.employeeForm.value, id: this.selectedEmployeeId };
            this.apiService.updateEmployee(employeeData).subscribe({
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
    deleteEmployee(employeeId: number, event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to delete this employee?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "p-button-danger p-button-text",
            rejectButtonStyleClass: "p-button-text",
            acceptIcon: "none",
            rejectIcon: "none",
    
            accept: () => {
                this.selectedEmployeeId = employeeId;
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
            this.apiService.deleteEmployee(this.selectedEmployeeId).subscribe({
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
}
