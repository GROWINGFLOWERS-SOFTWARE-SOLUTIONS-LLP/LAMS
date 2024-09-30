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

@Component({
    selector: 'app-all-employee-profiles',
    templateUrl: './all-employee-profiles.component.html',
    styleUrls: ['./all-employee-profiles.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, ButtonModule, DialogModule, TableModule, CalendarModule, InputTextModule, DropdownModule]
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
            password: ['', [Validators.required, Validators.minLength(6)]],
            mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Assumes 10-digit phone number
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
            this.apiService.addEmployee(this.employeeForm.value).subscribe(() => {
                this.loadEmployees();
                this.showDialog = false;
            });
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
            this.apiService.updateEmployee(employeeData).subscribe(() => {
                this.loadEmployees();
                this.showDialog = false;
            });
        }
    }

    deleteEmployee(id: number) {
        this.apiService.deleteEmployee(id).subscribe(() => {
            this.loadEmployees();
        });
    }

    // Helper function to check form field validity
    isFieldInvalid(field: string): boolean {
        const control = this.employeeForm.get(field);
        return control ? control.invalid && (control.touched || control.dirty) : false;
    }
}
