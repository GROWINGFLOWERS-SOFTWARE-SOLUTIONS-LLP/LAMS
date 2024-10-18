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

//department related veriabls
  departmentForm: FormGroup;
  departments: any[] = [];
   selectedDepartmentId: string | null = null;
   showDepartmentList: boolean = false;

  
  // Manager-related variables
  managerForm: FormGroup;
  managers: any[] = [];
  selectedManagerId: string | null = null;
  showManagerList: boolean = false;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    // Initialize forms

    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required], // Only Department Name field

});  
    
    this.managerForm = this.fb.group({
      managerName: ['', Validators.required], // Manager Name field
    });

        
  }
     
  ngOnInit(): void {
    this.loadManagers();
    this.loadDepartments();
  }
    toggleDepartmentList(): void {
    this.showDepartmentList = !this.showDepartmentList;
  }

  loadDepartments(): void {
    this.apiService.getdepartments().subscribe(
      (data) => {
        this.departments = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load departments',
        });
      }
    );
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      return;
    }

    const departmentData = {
      id: this.selectedDepartmentId ?? new Date().getTime().toString(),
      departmentName: this.departmentForm.value.departmentName, // Only Department Name
    };

    if (this.selectedDepartmentId) {
      this.apiService.updateDepartments(departmentData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Department Updated',
            detail: 'Department details have been updated successfully.',
          });
          this.loadDepartments();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update department',
          });
        }
      );
    } else {
      this.apiService.addDepartments(departmentData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Department Added',
            detail: 'New department has been added successfully.',
          });
          this.loadDepartments();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add department',
          });
        }
      );
    }

    this.resetForm();
  }

  editDepartment(department: any): void {
    this.selectedDepartmentId = department.id;
    this.departmentForm.patchValue({
      departmentName: department.departmentName, // Only Department Name
    });
    this.showDepartmentList = false;
  }

  deleteDepartment(departmentId: string, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this department?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.deleteDepartments(departmentId).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Department Deleted',
              detail: 'Department has been deleted successfully.',
            });
            this.loadDepartments(); // Reload the list after deletion
          },
          (error: any) => {
            console.error('Delete error:', error); // Log the error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete department: ' + error.status + ' ' + error.message,
            });
          }
        );
      },
    });
  }

  resetForm(): void {
    this.selectedDepartmentId = null;
    this.departmentForm.reset();
    this.showDepartmentList = true;
  }



  
  
  
  // Manager-related methods
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

  submitManager(): void {
    if (this.managerForm.invalid) {
      return;
    }

    const managerData = {
      id: this.selectedManagerId ?? new Date().getTime().toString(),
      managerName: this.managerForm.value.managerName,
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

    this.resetManagerForm();
  }

  editManager(manager: any): void {
    this.selectedManagerId = manager.id;
    this.managerForm.patchValue({
      managerName: manager.managerName,
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
            this.loadManagers();
          },
          (error: any) => {
            console.error('Delete error:', error);
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


  resetManagerForm(): void {
    this.selectedManagerId = null;
    this.managerForm.reset();
    this.showManagerList = true;
  }
}
// export class RolesListComponent implements OnInit {
//   departmentForm: FormGroup;
//   departments: any[] = [];
//   selectedDepartmentId: string | null = null;
//   showDepartmentList: boolean = false;

  

//   constructor(
//     private fb: FormBuilder,
//     private confirmationService: ConfirmationService,
//     private messageService: MessageService,
//     private apiService: ApiService
//   ) {
//     this.departmentForm = this.fb.group({
//       departmentName: ['', Validators.required], // Only Department Name field

      
//     });
//   }

//   ngOnInit(): void {
//     this.loadDepartments();
//   }

//   toggleDepartmentList(): void {
//     this.showDepartmentList = !this.showDepartmentList;
//   }

//   loadDepartments(): void {
//     this.apiService.getdepartments().subscribe(
//       (data) => {
//         this.departments = data;
//       },
//       (error) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to load departments',
//         });
//       }
//     );
//   }

//   onSubmit(): void {
//     if (this.departmentForm.invalid) {
//       return;
//     }

//     const departmentData = {
//       id: this.selectedDepartmentId ?? new Date().getTime().toString(),
//       departmentName: this.departmentForm.value.departmentName, // Only Department Name
//     };

//     if (this.selectedDepartmentId) {
//       this.apiService.updateDepartments(departmentData).subscribe(
//         () => {
//           this.messageService.add({
//             severity: 'success',
//             summary: 'Department Updated',
//             detail: 'Department details have been updated successfully.',
//           });
//           this.loadDepartments();
//         },
//         (error) => {
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: 'Failed to update department',
//           });
//         }
//       );
//     } else {
//       this.apiService.addDepartments(departmentData).subscribe(
//         () => {
//           this.messageService.add({
//             severity: 'success',
//             summary: 'Department Added',
//             detail: 'New department has been added successfully.',
//           });
//           this.loadDepartments();
//         },
//         (error) => {
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: 'Failed to add department',
//           });
//         }
//       );
//     }

//     this.resetForm();
//   }

//   editDepartment(department: any): void {
//     this.selectedDepartmentId = department.id;
//     this.departmentForm.patchValue({
//       departmentName: department.departmentName, // Only Department Name
//     });
//     this.showDepartmentList = false;
//   }

//   deleteDepartment(departmentId: string, event: Event): void {
//     this.confirmationService.confirm({
//       target: event.target as EventTarget,
//       message: 'Are you sure you want to delete this department?',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//         this.apiService.deleteDepartments(departmentId).subscribe(
//           () => {
//             this.messageService.add({
//               severity: 'success',
//               summary: 'Department Deleted',
//               detail: 'Department has been deleted successfully.',
//             });
//             this.loadDepartments(); // Reload the list after deletion
//           },
//           (error: any) => {
//             console.error('Delete error:', error); // Log the error
//             this.messageService.add({
//               severity: 'error',
//               summary: 'Error',
//               detail: 'Failed to delete department: ' + error.status + ' ' + error.message,
//             });
//           }
//         );
//       },
//     });
//   }

//   resetForm(): void {
//     this.selectedDepartmentId = null;
//     this.departmentForm.reset();
//     this.showDepartmentList = true;
//   }




// }