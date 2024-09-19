import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../Core/Services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-all-employee-profiles',
  standalone: true,
  imports: [ButtonModule, FormsModule, CommonModule, DialogModule],
  templateUrl: './all-employee-profiles.component.html',
  styleUrls: ['./all-employee-profiles.component.css']
})
export class AllEmployeeProfilesComponent implements OnInit {
  employee = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNumber: '',
    department: '',
    manager: '',
    role: '',
    joiningDate: '',
    address: '',
  };

  employees: any[] = [];
  showDialog = false;
  isEditing = false; // Flag to determine if editing an existing employee

  constructor(private route: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  prepareEmployee(employee: any = { firstName: '', lastName: '', email: '', mobileNumber: '', department: '', manager: '', role: '', joiningDate: '', address: '' }) {
    this.employee = { ...employee };
    this.isEditing = !!employee.id; // Determine if we are editing or adding
  }

  addEmployee() {
    this.apiService.addEmployee(this.employee).subscribe(() => {
      this.loadEmployees();
      this.showDialog = false;
    });
  }

  updateEmployee() {
    this.apiService.updateEmployee(this.employee).subscribe(() => {
      this.loadEmployees();
      this.showDialog = false;
    });
  }

  editEmployee(employee: any) {
    this.prepareEmployee(employee);
    this.showDialog = true;
  }

  deleteEmployee(id: number) {
    const confirmation = confirm('Are you sure you want to delete this employee?');
    if (confirmation) {
      this.apiService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }

  loadEmployees() {
    this.apiService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }
}
