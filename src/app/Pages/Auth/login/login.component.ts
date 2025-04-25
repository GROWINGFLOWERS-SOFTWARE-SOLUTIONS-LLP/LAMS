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

import { ChangePasswordComponent } from '../change-password/change-password.component';
import { AdminService } from '../../../Core/Services/Admin/admin.service';
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
    ToastModule,
    LoaderComponent
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService] // Provide MessageService here
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  loading: boolean = false;
  isChangePassword:boolean=false;

 
  constructor(
    private router: Router,
    private apiService: AdminService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService, // Inject MessageService here
    
  ) {}
 
  ngOnInit() {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
 
  get emailId() {
    return this.loginForm.controls['emailId'];
  }
 
  get password() {
    return this.loginForm.controls['password'];
  }
 
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
 
  loginFun() {
    debugger;
    this.loading = true;
      this.apiService.loginValidation(this.loginForm.value).subscribe(
        (data:any) => {
          this.loading = false
          localStorage.setItem("userValue",JSON.stringify(data))
           if(data && data.password == 'Gfss@2024'){
             this.router.navigate(['/change-password']);

          } else {
          debugger;
           this.roleBasedRouting(data.role)
          }
        },
      );
  }
 
  roleBasedRouting(user: any) {
    if (user) {
      if (user === 'Admin') {
        this.router.navigate(['/dashboard']);
      } else if (user === 'Employee') {
        this.router.navigate(['/attendance']);
      } else if (user === 'Manager') {
        this.router.navigate(['/attendance']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
}