import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../Core/Services/api.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-all-employee-profiles',
    templateUrl: './all-employee-profiles.component.html',
    styleUrls: ['./all-employee-profiles.component.css'],
    standalone: true,
    imports: [CommonModule, ButtonModule, DialogModule, TableModule, FormsModule, ReactiveFormsModule, CalendarModule, InputTextModule, DropdownModule]
})
export class AllEmployeeProfilesComponent implements OnInit {
    employees: any[] = [];
    employeeForm: FormGroup;
    showDialog: boolean = false;
    isEditing: boolean = false;
    selectedEmployeeId: number | null = null;

    constructor(private apiService: ApiService, private formBuilder: FormBuilder, private router: Router) {
        // Create the employee form
        this.employeeForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            mobileNumber: ['', Validators.required],
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

    // Load Employees from API
    loadEmployees() {
        this.apiService.getEmployees().subscribe((data) => {
            this.employees = data;
        });
    }

    // Open dialog for adding a new employee
    openDialog() {
        this.showDialog = true;
        this.isEditing = false;
        this.employeeForm.reset();
    }

    // Add a new employee
    addEmployee() {
        if (this.employeeForm.valid) {
            this.apiService.addEmployee(this.employeeForm.value).subscribe(() => {
                this.loadEmployees();
                this.showDialog = false;
            });
        }
    }

    // Edit an existing employee
    editEmployee(employee: any) {
        this.employeeForm.patchValue(employee);
        this.isEditing = true;
        this.showDialog = true;
        this.selectedEmployeeId = employee.id; // Capture the selected employee's ID
    }

    // Update an existing employee
    updateEmployee() {
        if (this.employeeForm.valid) {
            const employeeData = { ...this.employeeForm.value, id: this.selectedEmployeeId }; // Include the employee ID
            this.apiService.updateEmployee(employeeData).subscribe(() => {
                this.loadEmployees();
                this.showDialog = false;
            });
        }
    }

    // Delete an employee
    deleteEmployee(id: number) {
        this.apiService.deleteEmployee(id).subscribe(() => {
            this.loadEmployees();
        });
    }
}





