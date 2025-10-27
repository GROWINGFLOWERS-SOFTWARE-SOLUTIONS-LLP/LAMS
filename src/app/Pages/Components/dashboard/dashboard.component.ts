import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../../Core/Services/api.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AdminService } from '../../../Core/Services/Admin/admin.service';
import { EmployeeService } from '../../../Core/Services/Employee/employee.service';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { ManagerService } from '../../../Core/Services/Manager/manager.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CardModule,
        AvatarModule,
        ToastModule,
        ProgressSpinnerModule,
        InputTextModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        TableModule
    ],
    providers: [MessageService],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {

    loggedInUserName!: string;
    totalEmployees!: number;
    totalLeaves!: number;
    remainingLeaves!: number;
    totalAttendance!: number;
    absent!: number;
    leavesTaken!: number;
    isLoading = true;
    projects: any[] = [];
    activeProjectsCount = 0;
    selectedProject: any = null;
    isProjectListVisible = false;
    selectedEmployee: any = { employee: null, role: '', manager: null };
    employees: any[] = [];
    managers: any[] = [];
    currentProjectName: string = '';
    dashboard: any;
    dashboardData: any;
    showProjectDialog: boolean = false;
    holidays: any[] = [];
    isManagerList: boolean = false;
    selectedProject1: any;
    assignDialogVisible: boolean = false;
    selectedProjectName: string = '';
    searchText: string = '';
    projId: string = '';


    constructor(private apiService: ApiService, private adminService: AdminService,
         private employeeService: EmployeeService, private messageService: MessageService,private managerService: ManagerService, 
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.getDashbaordData();
        this.loadProjects();
        this.loadHolidays();
        this.loadEmployees();
        this.loadManagers();
      
    }


    // Managers
    loadManagers(): void {
        this.adminService.getAllManagersList().subscribe({
            next: (res: any) => {
                console.log('Managers response:', res);
                this.managers = Array.isArray(res) ? res : res.data || [];
            },
            error: (err) => {
                console.error('Failed to fetch managers:', err);
            }
        });
    }

    // Employees
    loadEmployees() {
        this.employeeService.getEmployees().subscribe({
            next: (res) => {
                this.employees = res;
            },
            error: (err) => {
                console.error('Failed to fetch employees:', err);
            }
        });
    }


    // Employees Filtered - role=Employee
    filteredEmployees(): any[] {
        if (!this.employees) return [];
        const search = this.searchText.toLowerCase();

        return this.employees
            .filter(emp => emp.role?.toLowerCase() === 'employee')
            .filter(emp => {
                const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
                const email = emp.emailId?.toLowerCase() || '';
                const mobile = emp.mobile?.toString() || '';
                return !this.searchText || fullName.includes(search) || email.includes(search) || mobile.includes(search);
            });
    }

    // Managers Filtered - role=Manager
    filteredManagers(): any[] {
        if (!this.employees) return [];
        const search = this.searchText.toLowerCase();

        return this.employees
            .filter(emp => emp.role?.toLowerCase() === 'manager')
            .filter(emp => {
                const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
                const email = emp.emailId?.toLowerCase() || '';
                const mobile = emp.mobile?.toString() || '';
                return !this.searchText || fullName.includes(search) || email.includes(search) || mobile.includes(search);
            });
    }

    // Projects 
    loadProjects(): Promise<void> {
        return new Promise(resolve => {
            this.adminService.getAllProjectsList().subscribe((projects: any) => {
                this.projects = projects.data;
                console.log('Projects:', this.projects);
                this.activeProjectsCount = projects.data.filter((project: any) => project.status === 'active').length;
                resolve();
            });
        });
    }

    showProjectDetails(project: any): void {

        this.selectedProject = project;
    }

    showAssignProjectForm(projectName: string) {
        this.currentProjectName = projectName;
        this.isProjectListVisible = true;
    }

    assignProjectToEmployee() {
        this.isProjectListVisible = false;
    }

    // Dashboard Data-Employees,Departments,Projects,Reports
    getDashbaordData() {
        this.dashboard = JSON.parse(localStorage.getItem("userValue") || "null");
        console.log('Employee Id:', this.dashboard);
        this.apiService.getDashboard(this.dashboard.empId).subscribe((data: any) => {
            console.log('Dashboard Data:', data);
            this.dashboardData = data;
            this.isLoading = false;
        });
    }

    // Holiday List
    // loadHolidays(): void {
    //     this.employeeService.getAllHolidays().subscribe({
    //         next: (response) => {
    //             console.log('Raw API response:', response);

    //             if (Array.isArray(response)) {
    //                 this.holidays = response;
    //             } else if (response?.data && Array.isArray(response.data)) {
    //                 this.holidays = response.data;
    //             } else {
    //                 this.holidays = [];
    //                 console.warn('Unexpected response format:', response);
    //             }

    //             if (this.holidays.length > 0) {
    //                 console.log('Holiday sample:', this.holidays[0]);
    //             }
    //         },
    //         error: (err) => {
    //             console.error('Error fetching holidays:', err);
    //         }
    //     });
    // }
loadHolidays(): void {
  this.employeeService.getAllHolidays().subscribe({
    next: (response) => {
      console.log('Raw API response:', response);

      // Extract array from response (same as your current safe handling)
      let raw: any[] = [];
      if (Array.isArray(response)) {
        raw = response;
      } else if (response?.data && Array.isArray(response.data)) {
        raw = response.data;
      } else {
        raw = [];
        console.warn('Unexpected response format:', response);
      }

      // Helper: convert a date (string or Date) -> local date-only (midnight)
      const toLocalDateOnly = (d: string | Date): Date => {
        const dt = new Date(d); // parse incoming date/time string
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()); // local midnight for that calendar day
      };

      // Today's local date-only (midnight)
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Filter: keep only holidays with date >= today
      const upcoming = raw
        .map(h => ({ ...h, __holidayDateObj: toLocalDateOnly(h.holidayDate) })) // attach local date for sorting
        .filter(h => h.__holidayDateObj.getTime() >= today.getTime())
        .sort((a, b) => a.__holidayDateObj.getTime() - b.__holidayDateObj.getTime())
        .map(h => {
          // remove helper field if you don't want it in the final objects
          const { __holidayDateObj, ...rest } = h;
          return rest;
        });

      this.holidays = upcoming;

      if (this.holidays.length > 0) {
        console.log('Upcoming holiday sample:', this.holidays[0]);
      } else {
        console.log('No upcoming holidays found.');
      }
    },
    error: (err) => {
      console.error('Error fetching holidays:', err);
      this.holidays = [];
    }
  });
}

    // Employee Leave List
    employeeLeaves = [
        {
            employeeName: 'Amit Sharma',
            leaveType: 'Casual Leave',
            fromDate: '2025-07-01',
            toDate: '2025-07-03',
            status: 'Approved',
        },
        {
            employeeName: 'Pooja Verma',
            leaveType: 'Sick Leave',
            fromDate: '2025-07-05',
            toDate: '2025-07-06',
            status: 'Pending',
        },
        {
            employeeName: 'Rahul Das',
            leaveType: 'Earned Leave',
            fromDate: '2025-07-10',
            toDate: '2025-07-15',
            status: 'Rejected',
        },
        {
            employeeName: 'Amit Sharma',
            leaveType: 'Casual Leave',
            fromDate: '2025-07-01',
            toDate: '2025-07-03',
            status: 'Approved',
        },
        {
            employeeName: 'Pooja Verma',
            leaveType: 'Sick Leave',
            fromDate: '2025-07-05',
            toDate: '2025-07-06',
            status: 'Pending',
        },
        {
            employeeName: 'Rahul Das',
            leaveType: 'Earned Leave',
            fromDate: '2025-07-10',
            toDate: '2025-07-15',
            status: 'Rejected',
        },
    ];


    // Fetch project details from backend
    fetchProjectDetails(projId: string) {
        if (!projId) return;

        this.adminService.getProjectDetails(projId).subscribe({
            next: (res: any) => {
                if (res?.status === 'true' && res.data) {
                    this.selectedProject = res.data;
                    console.log('Project Details:', this.selectedProject);
                } else {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: 'Failed to fetch project details.'
                    });
                }
            },
            error: (err) => {
                console.error('Error fetching project details:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Unable to fetch project details from server.'
                });
            }
        });
    }

    openAssignDialog(projectName: string, projId: string) {
        this.projId = projId;
        this.selectedProjectName = projectName;
        this.isManagerList = this.dashboard?.role === 'Admin';
        this.assignDialogVisible = true;
    }

    assignToProject(person: any) {
        if (!this.projId) {
            console.warn('Missing project selection');
            return;
        }

        if (this.isManagerList) {
            // Manager assignment
            if (!person?.empId) {
                console.warn('Manager ID missing');
                return;
            }

            // Use the corrected service method
            this.adminService.assignProjectToManager(this.projId, person.empId).subscribe({
                next: (res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Project assigned to manager successfully.'
                    });
                    this.assignDialogVisible = false;
                },
                error: (err) => {
                    if (err.status === 409 || err.error?.message?.includes('already assigned')) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warning',
                            detail: 'This project is already assigned to the selected manager.'
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to assign project to manager.'
                        });
                    }
                }
            });

        } else {
            // Employee assignment
            if (!person?.empId) {
                console.warn('Employee ID missing');
                return;
            }

            // Use the corrected service method
            this.adminService.assignEmployeeToProject(person.empId, this.projId).subscribe({
                next: (res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Project assigned to employee successfully.'
                    });
                    this.assignDialogVisible = false;
                },
                error: (err) => {
                    if (err.status === 409 || err.error?.message?.includes('already assigned')) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warning',
                            detail: 'This employee is already assigned to the selected project.'
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to assign project to employee.'
                        });
                    }
                }
            });
        }
    }





}
