import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../Core/Services/api.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Import ProgressSpinner
import { ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ProgressSpinnerModule // Include ProgressSpinnerModule here
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  loading: boolean = false; // State to control loader visibility
  apiCallCompleted: boolean = false; // Flag to track API call completion

  constructor(
    private router: Router, 
    private apiService: ApiService, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  loginFun() {
    console.log('Login initiated...');
    
    // Show loader when login starts
    this.loading = true;
    console.log('Loading state set to true:', this.loading);

    // Ensure Angular change detection catches the update
    this.cdr.detectChanges();

    const spinnerTimeout = 10000; // 10 seconds
    let apiCallCompleted = false;

    // Start a timeout to hide the spinner after the minimum display time
    const hideSpinnerTimeout = setTimeout(() => {
        this.loading = false; // Hide spinner after the timeout
        console.log('Loading state set to false (timeout):', this.loading);
        this.cdr.detectChanges(); // Detect changes after the timeout
    }, spinnerTimeout);

    this.apiService.getEmployees().subscribe(
      (data) => {
        this.apiCallCompleted = true; // Mark the API call as completed
        clearTimeout(hideSpinnerTimeout); // Clear the timeout

        let users = data.find(
          (user: any) => user.email === this.loginForm.value.email && user.password === this.loginForm.value.password
        );

        if (users) {
          localStorage.setItem('users', JSON.stringify(users));
          this.roleBasedRouting(users);
        } else {
          console.log('User  not found');
          this.router.navigate(['/login']);
        }

        // Ensure the spinner is hidden after the minimum duration
        if (this.loading) {
          setTimeout(() => {
            this.loading = false; // Hide spinner after the API response
            console.log('Loading state set to false (after response):', this.loading);
            this.cdr.detectChanges(); // Detect changes after the response
          }, spinnerTimeout);
        }
      },
      (error) => {
        console.error(error);
        apiCallCompleted = true; // Mark the API call as completed
        clearTimeout(hideSpinnerTimeout); // Clear the timeout

        // Ensure the spinner is hidden after the minimum duration
        if (this.loading) {
          setTimeout(() => {
              this.loading = false; // Hide spinner after the API response
              console.log('Loading state set to false (error response):', this.loading);
              this.cdr.detectChanges(); // Detect changes after the response
          }, spinnerTimeout);
      }
      }
    );
  }


  roleBasedRouting(users: any) {
    if (users && users.role) {
      if (users.role === 'Admin') {
        this.router.navigate(['/employeeprofile']);
      } else if (users.role === 'Employee') {
        this.router.navigate(['/attendance']);
      } else if (users.role === 'Manager') {
        this.router.navigate(['/managerRequest']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
}