import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Core/Services/api.service';

// PrimeNG modules
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  templateUrl: './profile-form.component.html',
  styleUrls: [],
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    ToastModule
  ],
})
export class ProfileFormComponent implements OnInit {
  employee: any = {};
  departments = ['Engineering', 'QA Testing', 'Admin', 'Human Resources'];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const userValue = localStorage.getItem('userValue');
    const employeeId = userValue ? JSON.parse(userValue).empId : null;

    if (employeeId) {
      this.apiService.getProfile(employeeId).subscribe((data: any) => {
        this.employee = data;
      });
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.apiService.updateProfile(this.employee).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully',
          });

          // Optionally redirect after short delay
          setTimeout(() => {
            this.router.navigateByUrl('profile');
          }, 1500);
        },
        error => {
          console.error('Error updating profile', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update profile',
          });
        }
      );
    }
  }
}
