import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AdminService } from '../../../Core/Services/Admin/admin.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [MessageService],
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  getEmailId: any;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatcher }
    );
  }

  passwordMatcher(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      let email: any = localStorage.getItem('userValue');
      this.getEmailId = JSON.parse(email);
      let obj = {
        emailId: this.getEmailId.emailId,
        password: this.passwordForm.value.newPassword,
        oldpassword: this.passwordForm.value.currentPassword,
      };
      this.adminService.changePassword(obj).subscribe((res: any) => {
        if (res && res?.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password changed successfully',
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        }
      });
    }
  }
}
