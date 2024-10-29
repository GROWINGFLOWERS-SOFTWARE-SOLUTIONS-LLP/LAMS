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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
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
    ProgressSpinnerModule,
  ],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RolesListComponent implements OnInit {
  departmentForm: FormGroup;
  departments: any[] = [];
  selectedDepartmentId: string | null = null;
  showDepartmentList: boolean = false;
  loading: boolean = false; // Spinner control variable

  roleForm: FormGroup;
  roles: any[] = [];
  selectedRoleId: string | null = null;
  showRoleList: boolean = false;

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
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required],
    });

    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
    });

    this.managerForm = this.fb.group({
      managerName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadManagers();
    this.loadDepartments();
  }

  toggleRoleList(): void {
    this.showRoleList = !this.showRoleList;
  }

  loadRoles(): void {
    this.loading = true;
    setTimeout(() => {
      this.apiService.getRoles().subscribe(
        (data) => {
          this.roles = data;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load roles',
          });
        }
      );
    }, 500); // Adjust the timeout duration as needed (500 ms in this case)
  }

  submitRole(): void {
    if (this.roleForm.invalid) {
      return;
    }
    this.loading = true;
    const roleData = {
      id: this.selectedRoleId ?? new Date().getTime().toString(),
      roleName: this.roleForm.value.roleName,
    };

    const roleObservable = this.selectedRoleId
      ? this.apiService.updateRole(roleData)
      : this.apiService.addRole(roleData);

    roleObservable.subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: this.selectedRoleId ? 'Role Updated' : 'Role Added',
          detail: this.selectedRoleId
            ? 'Role details have been updated successfully.'
            : 'New role has been added successfully.',
        });
        this.loadRoles();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to ' + (this.selectedRoleId ? 'update' : 'add') + ' role',
        });
      }
    );

    this.resetRoleForm();
  }

  editRole(role: any): void {
    this.selectedRoleId = role.id;
    this.roleForm.patchValue({
      roleName: role.roleName,
    });
    this.showRoleList = false;
  }

  deleteRole(roleId: string, event: Event): void {
    this.loading = true;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this role?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.deleteRole(roleId).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Role Deleted',
              detail: 'Role has been deleted successfully.',
            });
            this.loadRoles();
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete role: ' + error.status + ' ' + error.message,
            });
          }
        );
      },
    });
  }

  resetRoleForm(): void {
    this.selectedRoleId = null;
    this.roleForm.reset();
    this.showRoleList = true;
  }

  toggleDepartmentList(): void {
    this.showDepartmentList = !this.showDepartmentList;
  }

  loadDepartments(): void {
    this.loading = true;
    setTimeout(() => {
      this.apiService.getdepartments().subscribe(
        (data) => {
          this.departments = data;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load departments',
          });
        }
      );
    }, 2000); // Adjust the timeout duration as needed
  }
  

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      return;
    }
    this.loading = true;
    const departmentData = {
      id: this.selectedDepartmentId ?? new Date().getTime().toString(),
      departmentName: this.departmentForm.value.departmentName,
    };

    const departmentObservable = this.selectedDepartmentId
      ? this.apiService.updateDepartments(departmentData)
      : this.apiService.addDepartments(departmentData);

    departmentObservable.subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: this.selectedDepartmentId ? 'Department Updated' : 'Department Added',
          detail: this.selectedDepartmentId
            ? 'Department details have been updated successfully.'
            : 'New department has been added successfully.',
        });
        this.loadDepartments();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to ' + (this.selectedDepartmentId ? 'update' : 'add') + ' department',
        });
      }
    );

    this.resetForm();
  }

  editDepartment(department: any): void {
    this.selectedDepartmentId = department.id;
    this.departmentForm.patchValue({
      departmentName: department.departmentName,
    });
    this.showDepartmentList = false;
  }

  deleteDepartment(departmentId: string, event: Event): void {
    this.loading = true;
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
            this.loadDepartments();
            this.loading = false;
          },
          (error) => {
            this.loading = false;
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

  toggleManagerList(): void {
    this.showManagerList = !this.showManagerList;
  }

  loadManagers(): void {
    this.loading = true;
    setTimeout(() => {
      this.apiService.getManagers().subscribe(
        (data) => {
          this.managers = data;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load managers',
          });
        }
      );
    }, 500); // Adjust the timeout duration as needed
  }
  submitManager(): void {
    if (this.managerForm.invalid) {
      return;
    }
    this.loading = true;
    const managerData = {
      id: this.selectedManagerId ?? new Date().getTime().toString(),
      managerName: this.managerForm.value.managerName,
    };

    const managerObservable = this.selectedManagerId
      ? this.apiService.updateManager(managerData)
      : this.apiService.addManager(managerData);

    managerObservable.subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: this.selectedManagerId ? 'Manager Updated' : 'Manager Added',
          detail: this.selectedManagerId
            ? 'Manager details have been updated successfully.'
            : 'New manager has been added successfully.',
        });
        this.loadManagers();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to ' + (this.selectedManagerId ? 'update' : 'add') + ' manager',
        });
      }
    );

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
    this.loading = true;
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
            this.loading = false;
          },
          (error) => {
            this.loading = false;
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
