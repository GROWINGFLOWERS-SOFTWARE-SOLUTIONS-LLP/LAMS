import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Core/Services/api.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../../Core/Services/Admin/admin.service';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  templateUrl: './profile-form.component.html',
  styleUrls: [],
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    ToastModule
  ],
})
export class ProfileFormComponent implements OnInit {
  department = [];
  profileForm!: FormGroup;
  employeeId: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const userValue = localStorage.getItem('userValue');
    this.employeeId = userValue ? JSON.parse(userValue).empId : null;

    this.getProfileForm();
    this.getDepartments();
    this.getProfile();
  }

  getProfileForm() {
    this.profileForm = this.fb.group({
      empId: [this.employeeId],
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      emailId: [{ value: '', disabled: true }],
      mobile: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', Validators.required],
      joiningDate: [{ value: '', disabled: true }],
      address: ['', Validators.required]
    });
  }

  getProfile() {
    this.apiService.getProfile(this.employeeId).subscribe((data: any) => {
      if (data.joiningDate) {
        data.joiningDate = new Date(data.joiningDate);
      }
      this.profileForm.patchValue(data);
    });
  }
  
  getDepartments() {
    this.adminService.getAllDepartmentsList().subscribe((data: any) => {
      this.department = data;
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = { ...this.profileForm.getRawValue() }; // include disabled fields
      this.apiService.updateProfile(formData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully',
          });
          this.router.navigate(['profile']);
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update profile',
          });
        }
      );
    }
  }
}
