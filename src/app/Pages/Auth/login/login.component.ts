import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../Core/Services/api.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Import ProgressSpinner
import { ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { AdminService } from '../../../Core/Services/Admin/admin.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule, ImageModule,FormsModule,
    FormsModule, AvatarModule,
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
export class LoginComponent implements OnInit{



  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private apiService: AdminService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService, // Inject MessageService here

  ) { }


  ngOnInit() {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // loginFun() {
  //   // this.loading = false;
  //   this.cdr.detectChanges();

  //   this.apiService.loginValidation(this.loginForm.value).subscribe(
  //     (data: any) => {
      
  //       localStorage.setItem("userValue", JSON.stringify(data));
  //       if (data && data.password == 'Gfss@2024') {
  //         this.router.navigate(['/change-password']);

  //       } else {
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Sucessfully!' });
  //         this.roleBasedRouting(data.role)
  //       }

  //     },

  //   );

  // }
  loginFun() {
    this.cdr.detectChanges();
  
    this.apiService.loginValidation(this.loginForm.value).subscribe(
      (data: any) => {
        if (data) {
          localStorage.setItem("userValue", JSON.stringify(data));
          
          if (data.password === 'Gfss@2024') {
            this.router.navigate(['/change-password']);
            this.messageService.add({ severity: 'info', summary: 'Change Password', detail: 'Please change your default password.' });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!' });
            this.roleBasedRouting(data.role);
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid login response.' });
        }
      },
      (error) => {
        console.error('Login error:', error);
        this.messageService.add({ severity: 'error', summary: 'Login Error', detail: 'Invalid Username or Password. Please try again.' });
      }
    );
  }
  
  get emailId() {
    return this.loginForm.controls['emailId'];
  }
 
  get password() {
    return this.loginForm.controls['password'];
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