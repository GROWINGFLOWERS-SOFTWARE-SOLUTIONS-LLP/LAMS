import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Spinner module
import { Manager } from '../../../Core/Interfaces/manager'; // Manager interface
import { ApiService } from '../../../Core/Services/api.service'; // API service

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
    ProgressSpinnerModule, // Add the spinner module
  ],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RolesListComponent implements OnInit {
  managerForm: FormGroup; // Form for adding/editing managers
  managers: any[] = []; // Manager list
  selectedManagerId: string | null = null; // ID of selected manager (for editing)
  showManagerList: boolean = false; // Toggle between form and list views
  loading: boolean = false; // Spinner control for loading state

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private apiService: ApiService,
    private ngZone: NgZone
  ) {
    this.managerForm = this.fb.group({
      managerName: ['', Validators.required], // Manager Name input with validation
    });
  }

  ngOnInit(): void {
    this.loadManagers(); // Fetch managers when component initializes
  }

  // Toggle between manager list and form
  toggleManagerList(): void {
    this.showManagerList = !this.showManagerList;
  }

  // Fetch manager list from the API
  loadManagers(): void {
    this.loading = true; // Show spinner while loading
    setTimeout(() => {
      this.apiService.getManagers().subscribe(
        (data) => {
          this.managers = data; // Populate the manager list
          this.loading = false; // Hide spinner
        },
        (error) => {
          this.loading = false; // Hide spinner on error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load managers',
          });
        }
      );
    }, 3000); // Simulated 3-second delay to showcase spinner
  }

  // Handle form submission for adding or editing a manager
  onSubmit(): void {
    if (this.managerForm.invalid) {
      return; // Do not proceed if form is invalid
    }

    const managerData = {
      id: this.selectedManagerId ?? new Date().getTime().toString(), // Generate new ID if creating a new manager
      managerName: this.managerForm.value.managerName, // Get manager name from form
    };

    if (this.selectedManagerId) {
      // Update an existing manager
      this.apiService.updateManager(managerData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Manager Updated',
            detail: 'Manager details have been updated successfully.',
          });
          this.loadManagers(); // Reload manager list after update
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
      // Add a new manager
      this.apiService.addManager(managerData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Manager Added',
            detail: 'New manager has been added successfully.',
          });
          this.loadManagers(); // Reload manager list after adding
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

    this.resetForm(); // Clear form after submission
  }

  // Edit a manager (populate the form with existing manager data)
  editManager(manager: any): void {
    this.selectedManagerId = manager.id; // Set selected manager ID
    this.managerForm.patchValue({
      managerName: manager.managerName, // Patch the form with manager's name
    });
    this.showManagerList = false; // Switch to form view
  }

  // Delete a manager with confirmation
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
            this.loadManagers(); // Reload manager list after deletion
          },
          (error: any) => {
            console.error('Delete error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete manager',
            });
          }
        );
      },
      reject: () => {
        // Action cancelled
      },
    });
  }

  // Reset the form after adding or editing a manager
  resetForm(): void {
    this.managerForm.reset(); // Clear form inputs
    this.selectedManagerId = null; // Reset selected manager ID
  }
}
