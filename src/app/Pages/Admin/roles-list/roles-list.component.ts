<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ApiService } from '../../../Core/Services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

=======
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Manager } from '../../../Core/Interfaces/manager';
import { ApiService } from '../../../Core/Services/api.service';
>>>>>>> b986535933478baa42a84ef274b61873659e1fa0

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [
    TabViewModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RolesListComponent implements OnInit {
  managerForm: FormGroup;
  managers: any[] = [];
  selectedManagerId: string | null = null;
  showManagerList: boolean = false;

<<<<<<< HEAD
}
=======
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    this.managerForm = this.fb.group({
      managerName: ['', Validators.required], // Only Manager Name field
    });
  }

  ngOnInit(): void {
    this.loadManagers();
  }

  toggleManagerList(): void {
    this.showManagerList = !this.showManagerList;
  }

  loadManagers(): void {
    this.apiService.getManagers().subscribe(
      (data) => {
        this.managers = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load managers',
        });
      }
    );
  }

  onSubmit(): void {
    if (this.managerForm.invalid) {
      return;
    }

    const managerData = {
      id: this.selectedManagerId ?? new Date().getTime().toString(),
      managerName: this.managerForm.value.managerName, // Only Manager Name
    };

    if (this.selectedManagerId) {
      this.apiService.updateManager(managerData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Manager Updated',
            detail: 'Manager details have been updated successfully.',
          });
          this.loadManagers();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update manager',
          });
        }
      );
    } else {
      this.apiService.addManager(managerData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Manager Added',
            detail: 'New manager has been added successfully.',
          });
          this.loadManagers();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add manager',
          });
        }
      );
    }

    this.resetForm();
  }

  editManager(manager: any): void {
    this.selectedManagerId = manager.id;
    this.managerForm.patchValue({
      managerName: manager.managerName, // Only Manager Name
    });
    this.showManagerList = false;
  }

  deleteManager(managerId: string, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this manager?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.deleteManager(managerId).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Manager Deleted',
              detail: 'Manager has been deleted successfully.',
            });
            this.loadManagers(); // Reload the list after deletion
          },
          (error: any) => {
            console.error('Delete error:', error); // Log the error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete manager: ' + error.status + ' ' + error.message,
            });
          }
        );
      },
    });
  }

  resetForm(): void {
    this.selectedManagerId = null;
    this.managerForm.reset();
    this.showManagerList = true;
  }
}
>>>>>>> b986535933478baa42a84ef274b61873659e1fa0
