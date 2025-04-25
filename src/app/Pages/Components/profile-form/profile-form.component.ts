import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Core/Services/api.service';

// PrimeNG modules
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
  ) { }

  ngOnInit(): void {
    const userValue = localStorage.getItem('userValue');
    this.employeeId = userValue ? JSON.parse(userValue).empId : null;

    this.getProfileForm();
    this.getDepartments();
    
      this.getProfile()
   
  }

  getProfileForm(){
    this.profileForm = this.fb.group({
      empId: [this.employeeId],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', Validators.required],
      joiningDate: [''],
      address: ['', Validators.required]
    });
  }

  getProfile() {
    this.apiService.getProfile(this.employeeId).subscribe((data: any) => {
      this.profileForm.patchValue(data);
    });
  }

  getDepartments() {
    this.adminService.getAllDepartmentsList().subscribe((data: any) => {
      this.department = data;
    })
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Form Data; ', this.profileForm.value);
      debugger;
      this.apiService.updateProfile(this.profileForm.value).subscribe(
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
