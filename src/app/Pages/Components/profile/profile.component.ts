import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, ButtonModule,CardModule,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  {
 
  constructor(private route:Router){}

  employee = {
    email: '                ',
    phoneNumber: '    ',
    // departmentId: '6', // Example ObjectId
    joiningDate: new Date('2022-02-16'),
    department: '     ',
    address: '   '
  }


  updateProfile(){
    this.route.navigateByUrl('profile-form');
  }
}




//   profileForm: FormGroup;

//   constructor(private fb: FormBuilder) {
//     // Initialize the form
//     this.profileForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phoneNumber: ['', [Validators.required]],
//       department: ['', Validators.required],
//       role: ['', Validators.required],
//       joiningDate: ['', Validators.required],
//       address: ['', Validators.required]
//     });
//   }

//   ngOnInit() {
//     // You can patch existing employee details here if necessary
//     // this.employeeForm.patchValue(this.employee);
//   }

//   updateProfile() {
//     if (this.profileForm.valid) {
//       console.log(this.profileForm.value);
//       // Handle form submission logic
//     } else {
//       // Mark all controls as touched to show validation errors
//       this.profileForm.markAllAsTouched();
//     }
//   }
// }