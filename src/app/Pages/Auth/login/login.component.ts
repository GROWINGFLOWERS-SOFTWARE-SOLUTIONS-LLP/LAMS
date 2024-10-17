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

    this.apiService.getEmployees().subscribe(
      (data) => {
        let users = data.find(
          (user: any) => user.email === this.loginForm.value.email && user.password === this.loginForm.value.password
        );

        if (users) {
          localStorage.setItem('users', JSON.stringify(users));
          this.roleBasedRouting(users);
        } else {
          console.log('User not found');
          this.router.navigate(['/login']);
        }

        // Hide loader after the login process completes
        this.loading = false;
        console.log('Loading state set to false:', this.loading);

        // Detect changes after the loading state update
        this.cdr.detectChanges();
      },
      (error) => {
        console.error(error);

        // Hide loader if there's an error
        this.loading = false;
        console.log('Loading state set to false (error):', this.loading);

        this.cdr.detectChanges();
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
    } else {
      this.router.navigate(['/login']);
    }
  }
}
