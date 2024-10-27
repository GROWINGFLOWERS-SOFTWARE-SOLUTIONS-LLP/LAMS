import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../Core/Services/api.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChangeDetectorRef } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'; // Import MessageService

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
    ProgressSpinnerModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService] // Provide MessageService here
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router, 
    private apiService: ApiService, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService // Inject MessageService here
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
    this.loading = true;
    this.cdr.detectChanges();

    this.apiService.getEmployees().subscribe(
      (data) => {
        const user = data.find(
          (user: any) => 
            user.email === this.loginForm.value.email && 
            user.password === this.loginForm.value.password
        );

        if (user) {
          localStorage.setItem('users', JSON.stringify(user));
          this.roleBasedRouting(user);
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: 'Welcome back!'
          });
        } else {
          
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid email or password'
          });
          this.router.navigate(['/login']);
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error(error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Login Error',
          detail: 'An error occurred during login. Please try again.'
        });
        this.cdr.detectChanges();
      }
    );
  }

  roleBasedRouting(user: any) {
    if (user && user.role) {
      if (user.role === 'Admin') {
        this.router.navigate(['/employeeprofile']);
      } else if (user.role === 'Employee') {
        this.router.navigate(['/attendance']);
      } else if (user.role === 'Manager') {
        this.router.navigate(['/managerRequest']);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
