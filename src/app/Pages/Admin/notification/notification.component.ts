import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagerService } from '../../../Core/Services/Manager/manager.service';
 import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast'; 

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    TableModule,
    ToastModule,
    CalendarModule,
    ReactiveFormsModule
  ],
  providers:[MessageService],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  dialogVisible = false;
  isEditMode = false;
  editIndex: number | null = null;
 
  notificationForm: FormGroup;
  notifications: any[] = [];
 
  constructor(private fb: FormBuilder, private managerService: ManagerService, private messageService: MessageService) {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: [null, Validators.required]
    });
  }
 
  ngOnInit() {
    this.loadNotifications();
  }
 
  loadNotifications() {
    this.managerService.getAllNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res.data || [];
      },
      error: err => console.error('Failed to load notifications', err)
    });
  }
 
  openDialog() {
    this.resetForm();
    this.dialogVisible = true;
  }
 
  submitNotification() {
    if (this.notificationForm.valid) {
      const rawValue = this.notificationForm.value;
      const fixedDate = this.convertToLocalDateString(rawValue.date); // ✅ fix
 
      const formValue = {
        ...rawValue,
        date: fixedDate // ✅ send as 'yyyy-MM-dd' string
      };
 
      if (this.isEditMode && this.editIndex !== null) {
        const notificationId = this.notifications[this.editIndex].notificationId;
        this.managerService.updateNotification(notificationId, formValue).subscribe({
          next: () => {
            this.loadNotifications();
            this.resetForm();
              this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Notification updated successfully.'
          });
          },
          error: err => {
          console.error('Update failed', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update notification.'
          });
        }
        });
      } else {
        this.managerService.createNotification(formValue).subscribe({
          next: () => {
            this.loadNotifications();
            this.resetForm();
             this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Notification added successfully.'
          });
          },
          error: err => {
          console.error('Create failed', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add notification.'
          });
        }
        });
      }
    }
  }
 
  editNotification(index: number) {
    const selected = this.notifications[index];
    this.notificationForm.patchValue({
      title: selected.title,
      description: selected.description,
      date: new Date(selected.date) // OK as is, works with yyyy-MM-dd string
    });
    this.editIndex = index;
    this.isEditMode = true;
    this.dialogVisible = true;
  }
 
  deleteNotification(index: number) {
    const notificationId = this.notifications[index].notificationId;
    this.managerService.deleteNotification(notificationId).subscribe({
      next: () => this.loadNotifications(),
      error: err => console.error('Delete failed', err)
    });
  }
 
  resetForm() {
    this.notificationForm.reset();
    this.dialogVisible = false;
    this.isEditMode = false;
    this.editIndex = null;
  }
 
  // ✅ Fix: convert JS Date to yyyy-MM-dd string in local timezone
  convertToLocalDateString(date: Date): string {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().split('T')[0]; // "yyyy-MM-dd"
  }
}