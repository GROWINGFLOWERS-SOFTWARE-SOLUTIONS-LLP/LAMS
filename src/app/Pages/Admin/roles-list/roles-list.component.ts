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
import { AdminService } from '../../../Core/Services/Admin/admin.service';

// import { ApiService } from '../../../Core/Services/api.service';

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
  departmentForm !: FormGroup;
  departments: any = [];
  selectedDepartmentId: string | null = null;
  showDepartmentList: boolean = false;
  isLoading: boolean = false;

  roleForm !: FormGroup;
  roles: any = [];
  selectedRoleId: string | null = null;
  showRoleList: boolean = false;

  managerForm !: FormGroup;
  managers: any = [];
  selectedManagerId: string | null = null;
  showManagerList: boolean = false;

  projectForm !: FormGroup;
  projects: any = [];
  selectedProjectId: string | null = null;
  showProjectList: boolean = false;


  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    // Initialize the reactive form
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required]
    });

    this.roleForm = this.fb.group({
      roleName: ['', Validators.required]
    });

    this.managerForm = this.fb.group({
      managerName: ['', Validators.required]
    });

    this.projectForm = this.fb.group({
      projectName: ['', Validators.required]
    });

    this.toggleDepartmentList();
    // this.loadDepartments();
    // this.loadRoles();
    // this.loadManagers();
    // this.loadProjects();

  }

  loadDepartments() {
    this.getAllDepartmentsList();
    this.isLoading = false; // Hide the loader after the data is fetched
  }

  loadRoles() {
    this.getAllRolesList();
    this.isLoading = false; // Hide the loader after the data is fetched
  }

  loadManagers() {
    this.getAllManagersList();
    this.isLoading = false; // Hide the loader after the data is fetched
  }

  loadProjects() {
    this.getAllProjectsList();
    this.isLoading = false; // Hide the loader after the data is fetched
  }




  // Departments
  // Method to fetch the list of departments from the API
  getAllDepartmentsList() {
    this.adminService.getAllDepartmentsList().subscribe((data: any) => {
      this.departments = data;
    });
  }


  // Method to add or update a department
  onSubmit() {

    if (this.departmentForm.valid) {

      let department = { ...this.departmentForm.value };
      this.isLoading = true;

      if (this.selectedDepartmentId) {
        let updateDepartment = { ...this.departmentForm.value, departmentId: this.selectedDepartmentId ? this.selectedDepartmentId : null };
        this.adminService.updateDepartment(updateDepartment).subscribe((data: any) => {

          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department updated successfully!' });
          this.clearDepartmentForm();
          this.loadDepartments();
          this.showDepartmentList = true;
        });
      } else {
        // If no selectedDepartmentId, we are adding a new department
        this.adminService.createDepartment(department).subscribe((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
          this.clearDepartmentForm();
          this.loadDepartments();
          this.showDepartmentList = true;
        });
      }
    }
  }

  // Method to toggle the department list visibility
  toggleDepartmentList() {
    if (!this.showDepartmentList) {
      this.isLoading = true;
      this.getAllDepartmentsList();
      this.isLoading = false;
    }
    this.showDepartmentList = !this.showDepartmentList;
  }

  // Method to delete a department with confirmation
  deleteDepartment(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this department?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {

        this.adminService.deleteDepartment(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department deleted successfully!' });
          this.loadDepartments();
          this.showDepartmentList = false;
          //  this.isLoading = false;
        });
      },
      reject: () => { this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Department deletion cancelled!' }); }
    });
  }

  // Method to edit a department
  editDepartment(department: any) {

    this.departmentForm.patchValue({
      departmentName: department.departmentName,
    });
    this.selectedDepartmentId = department.depId;
    this.showDepartmentList = false; // Hide list and show the form
  }


  // Method to clear the form fields
  clearDepartmentForm() {
    this.departmentForm.reset();
    this.selectedDepartmentId = null;
    this.isLoading = false;
  }

  // Role
  // Method to fetch the list of roles from the API
  getAllRolesList() {
    this.adminService.getAllRolesList().subscribe((data: any) => {
      this.roles = data;
    });
  }

  // Method to add or update a role
  submitRole() {
    if (this.roleForm.valid) {
      debugger;
      let role = { ...this.roleForm.value };

      this.isLoading = true;
      debugger;
      if (this.selectedRoleId) {
        let updateRole = { ...this.roleForm.value, roleId: this.selectedRoleId ? this.selectedRoleId : null };
        this.adminService.updateRole(updateRole).subscribe((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role updated successfully!' });
          this.clearRoleForm();
          this.loadRoles();
          this.showRoleList = true;
        });
      } else {
        // If no selectedRoleId, we are adding a new role
        this.adminService.createRole(role).subscribe((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role added successfully!' });
          this.clearRoleForm();
          this.loadRoles();
          this.showRoleList = true;
        });
      }
    }
  }


  // Method to edit a role
  editRole(role: any) {
    debugger;
    this.roleForm.patchValue({
      roleName: role.roleName,
    });
    this.selectedRoleId = role.rolId;
    this.showRoleList = false; // Hide list and show the form
  }

  // Method to toggle the role list visibility
  toggleRoleList() {
    if (!this.showRoleList) {
      this.isLoading = true;
      this.getAllRolesList();
      this.isLoading = false;
    }
    this.showRoleList = !this.showRoleList;
  }

  // Method to delete a role with confirmation
  deleteRole(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this role?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        // Call the API to delete the role
        this.adminService.deleteRole(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role deleted successfully!' });
          this.loadRoles();
          this.showRoleList = false;
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Role deletion cancelled!' });
      }
    });
  }

  // Method to clear the form fields
  clearRoleForm() {
    this.roleForm.reset();
    this.selectedRoleId = null;
    this.isLoading = false;
  }


  // Manager
  // Method to fetch the list of managers from the API
  getAllManagersList() {
    this.adminService.getAllManagersList().subscribe((data: any) => {
      this.managers = data;
    });
  }

  // Method to add or update a manager
  submitManager() {
    if (this.managerForm.valid) {
      let manager = { ...this.managerForm.value };

      this.isLoading = true;

      if (this.selectedManagerId) {
        let updateManager = { ...this.managerForm.value, managerId: this.selectedManagerId ? this.selectedManagerId : null }
        this.adminService.updateManager(updateManager).subscribe((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Manager updated successfully!' });
          this.clearMangerForm();
          this.loadManagers();
          this.showManagerList = true;
        });
      } else {
        this.adminService.createManager(manager).subscribe((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Manager added successfully!' });
          this.clearMangerForm();
          this.loadManagers();
          this.showManagerList = true;
        });
      }
    }
  }

  // Method to toggle the manager list visibility
  toggleManagerList() {
    if (!this.showManagerList) {
      this.isLoading = true;
      this.getAllManagersList();
      this.isLoading = false;
    }
    this.showManagerList = !this.showManagerList;
  }

  // Method to delete a manager with confirmation
  deleteManager(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this manager?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        // Call the API to delete the manager
        this.adminService.deleteManager(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Manager deleted successfully!' });
          this.loadManagers();
          this.showManagerList = false;
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Manager deletion cancelled!' });
      }
    });
  }

  // Method to edit a manager
  editManager(manager: any) {

    this.managerForm.patchValue({
      managerName: manager.managerName,
    });
    this.selectedManagerId = manager.managId;
    this.showManagerList = false; // Hide list and show the form
  }


  // Method to clear the form fields
  clearMangerForm() {
    this.managerForm.reset();
    this.selectedManagerId = null;
    this.isLoading = false;
  }

  // Project
  // Method to fetch the list of projects from the API
  getAllProjectsList() {
    this.adminService.getAllProjectsList().subscribe((data: any) => {
      this.projects = data;
    });
  }

  // Method to add or update a project
  submitProject() {
    if (this.projectForm.valid) {

      let project = { ...this.projectForm.value };

      this.isLoading = true;

      if (this.selectedProjectId) {
        let updateProject = { ...this.projectForm.value, projectId: this.selectedProjectId ? this.selectedProjectId : null };
        this.adminService.updateProject(updateProject).subscribe((data: any) => {

          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project updated successfully!' });
          this.clearProjectForm();
          this.loadProjects();
          this.showProjectList = true;
        });
      } else {
        console.log('Project: ', project)
        this.adminService.createProject(project).subscribe((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project added successfully!' });
          this.clearProjectForm();
          this.loadProjects();
          this.showProjectList = true;
        });
      }
    }
  }



  // Method to toggle the project list visibility
  toggleProjectList() {
    if (!this.showProjectList) {
      this.isLoading = true;
      this.getAllProjectsList();
      this.isLoading = false;
    }
    this.showProjectList = !this.showProjectList;
  }

  // Method to delete a project with confirmation
  deleteProject(id: any) {
    console.log('Project ID: ', id);
    debugger;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this project?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        debugger;
        console.log('Accept button clicked. Deleting project...');
        // Call the API to delete the project
        this.adminService.deleteProject(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project deleted successfully!' });
          this.loadProjects();
          this.showProjectList = false;
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Project deletion cancelled!' });
      }
    });
  }

  // Method to edit a project
  editProject(project: any) {
    this.projectForm.patchValue({
      projectName: project.projectName,
    });
    this.selectedProjectId = project.projId;
    this.showProjectList = false; // Hide list and show the form
  }


  // Method to clear the form fields
  clearProjectForm() {
    this.projectForm.reset();
    this.selectedProjectId = null;
    this.isLoading = false;
  }

  confirmDelete(type: string, id: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this ${type}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        switch (type) {
          case 'department':
            this.deleteDepartment(id);
            break;
          case 'role':
            this.deleteRole(id);
            break;
          case 'project':
            this.deleteProject(id);
            break;
          case 'manager':
            this.deleteManager(id);
            break;
        }
      }
    });
  }
}
