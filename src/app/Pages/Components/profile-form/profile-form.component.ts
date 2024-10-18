import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../Core/Services/api.service';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [AvatarModule,ButtonModule,DialogModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css'
})
export class ProfileFormComponent {
  // visible: boolean = false;

  // showDialog() {
  //     this.visible = true;
  // }

  // constructor(private route:Router){}

  // updateProfile(){
  //   this.route.navigateByUrl('profile');
  // }
  employeeForm!: FormGroup;
 
  departments = [
    { label: 'Engineering', value: 'engineering' },
    { label: 'QA Testing', value: 'qa_testing' },
    { label: 'Admin', value: 'admin' },
    { label: 'Human Resources', value: 'hr' }
  ];
 
  constructor(private fb: FormBuilder, private apiService: ApiService) {}
 
  ngOnInit() {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      joiningDate: ['', Validators.required],
      address: ['', Validators.required]
    });
  }
 
  updateProfile() {
    if (this.employeeForm.valid) {
      this.apiService.updateEmployees(this.employeeForm.value).subscribe(
        (response) => {
          console.log('Employee updated successfully', response);
          // Handle success, e.g., show a success message or redirect
        },
        (error) => {
          console.error('Error updating employee', error);
          // Handle error, e.g., show an error message
        }
      );
    }
  }
}

