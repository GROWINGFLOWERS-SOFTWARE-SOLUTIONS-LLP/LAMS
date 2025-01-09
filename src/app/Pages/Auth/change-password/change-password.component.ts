import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,InputTextModule,FormsModule,CardModule,PasswordModule,ButtonModule,ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent{
  value: string | undefined;

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';


  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Submitted!', this.currentPassword);
    }
  
  
    if (form.valid) {
      console.log('Form Submitted!', this.newPassword);
    }

    if (form.valid) {
      console.log('Form Submitted!', this.newPassword, this.confirmNewPassword);
    }
  }
  }

