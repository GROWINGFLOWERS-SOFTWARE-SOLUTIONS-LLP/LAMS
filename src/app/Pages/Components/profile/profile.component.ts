import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../Core/Services/api.service';




interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  department: string;
  role: string;
  joiningDate: Date;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, ButtonModule,CardModule,ReactiveFormsModule,PaginatorModule,TableModule,CommonModule,InputTextModule,CalendarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  
  employees: Employee[] = [
    // {
    //   id: 1,
    //   firstName: 'Shubham',
    //   lastName: 'Sonje',
    //   email: 'ssonje30@gmail.com',
    //   mobileNumber: '9890628672',
    //   address: 'Nashik',
    //   department: 'IT',
    //   role: 'Developer',
    //   joiningDate: new Date('2024-01-02')
    // },
    // Add more employee objects as needed
  ];
  employeeService: any;
  employeess: Employee[] | undefined;
  // employeeService: any;

  // employees: any[] = [];
  // employeeService: any;

  constructor(private route:Router,apiService:ApiService){}

  

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe((data: Employee[]) => {
      this.employees = data;
    });
  }

  editEmployee({ employee }: { employee: Employee; }): void {
    // Logic for editing an employee
    this.route.navigateByUrl('profile-form');
  }

  deleteEmployee(id: number, event: Event) {
    event.stopPropagation();
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.loadEmployees();
    });
  }

  updateProfile(...args: []) {
    this.route.navigateByUrl('profile-form');
  }
}
 
//   constructor(private route:Router){}

//   visible: boolean = false;

//   showDialog() {
//       this.visible = true;
//   }

//   employee = {
//     email: '                ',
//     phoneNumber: '    ',
//     // departmentId: '6', // Example ObjectId
//     joiningDate: new Date('2022-02-16'),
//     department: '     ',
//     address: '   '
//   }


//   updateProfile(){
//     this.route.navigateByUrl('profile-form');
//   }
// }




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