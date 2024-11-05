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
import { LoaderComponent } from '../../Components/loader/loader.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
 
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
    ProgressSpinnerModule, // Include ProgressSpinnerModule here
    LoaderComponent, // Include LoaderComponent here
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
    this.loading = true;
    this.cdr.detectChanges();
 
    // Simulate 2-second delay for loader (whether login is successful or not)
    setTimeout(() => {
      this.apiService.getEmployees().subscribe(
        (data) => {
          let users = data.find(
            (user: any) => user.email === this.loginForm.value.email && user.password === this.loginForm.value.password
          );
 
          if (users) {
            this.apiService.setLoggedInUser(users);
            this.roleBasedRouting(users);
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
    }, 2000); // 2-second delay
  }
 
  roleBasedRouting(user: any) {
    if (user && user.role) {
      if (user.role === 'Admin') {
        this.router.navigate(['/dashboard']);
      } else if (user.role === 'Employee') {
        this.router.navigate(['/attendance']);
      } else if (user.role === 'Manager') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
}