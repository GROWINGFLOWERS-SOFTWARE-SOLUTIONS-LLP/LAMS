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

    constructor(private apiService: ApiService, private adminService: AdminService, private employeeService: EmployeeService, private messageService: MessageService
    ) { }
 project = {
    name: 'AI Integration Project',
    manager: 'John Doe',
    deadline: new Date(2025, 8, 15),
    status: 'In Progress',
    teamMembers: [
      { name: 'Alice Smith', role:'Manager'},
      { name: 'Bob Johnson',role: 'Developer'},
      { name: 'Charlie Davis',role: 'Developer' },
      { name: 'Alice Smith', role: 'Developer'},
      { name: 'Bob Johnson',role: 'Developer'},
      { name: 'Charlie Davis', role: 'Developer'}  
    ]
  };

    ngOnInit(): void {
        this.isLoading = true;
        this.getDashbaordData();
        this.loadProjects();
        this.loadHolidays();
        this.loadEmployees();
        this.loadManagers();
    }
    
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

    // filteredEmployees(): any[] {
    //     if (!this.searchText) return this.employees;

    //     const search = this.searchText.toLowerCase();

    //     return this.employees.filter(emp => {
    //         const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    //         const email = emp.emailId?.toLowerCase() || '';
    //         const mobile = emp.mobile?.toString() || '';

    //         return (
    //             fullName.includes(search) ||
    //             email.includes(search) ||
    //             mobile.includes(search)
    //         );
    //     });
    // }
filteredEmployees(): any[] {
    if (!this.searchText) return this.employees.filter(emp => emp.role === 'Employee');

    const search = this.searchText.toLowerCase();

    return this.employees
      .filter(emp => emp.role === 'Employee')  // Only employees here
      .filter(emp => {
        const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
        const email = emp.emailId?.toLowerCase() || '';
        const mobile = emp.mobile?.toString() || '';

        return (
          fullName.includes(search) ||
          email.includes(search) ||
          mobile.includes(search)
        );
    });
}

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

    getDashbaordData() {
        this.dashboard = JSON.parse(localStorage.getItem("userValue") || "null");
        console.log('Employee Id:', this.dashboard);
        this.apiService.getDashboard(this.dashboard.empId).subscribe((data: any) => {
            console.log('Dashboard Data:', data);
            this.dashboardData = data;
            this.isLoading = false;
        });
    }

    loadHolidays(): void {
        this.employeeService.getAllHolidays().subscribe({
            next: (response) => {
                console.log('Raw API response:', response);

                if (Array.isArray(response)) {
                    this.holidays = response;
                } else if (response?.data && Array.isArray(response.data)) {
                    this.holidays = response.data;
                } else {
                    this.holidays = [];
                    console.warn('Unexpected response format:', response);
                }

                if (this.holidays.length > 0) {
                    console.log('Holiday sample:', this.holidays[0]);
                }
            },
            error: (err) => {
                console.error('Error fetching holidays:', err);
            }
        });
    }


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

    selectedProject1: any;
    assignDialogVisible: boolean = false;
    selectedProjectName: string = '';
    searchText: string = '';
    projId: string = '';


    openAssignDialog(projectName: string, projId: string) {
        this.projId = projId;
        this.selectedProjectName = projectName;
        this.isManagerList = this.dashboard?.role === 'Admin';
        this.assignDialogVisible = true;
    }



    // assignToProject(manager: any) {
    //     if (!this.projId || !manager?.managId) {
    //         console.warn('Missing project or manager selection');
    //         return;
    //     }

    //     this.adminService.assignProjectToManager(this.projId, manager.managId)
    //         .subscribe({
    //             next: (res) => {
    //                 console.log('Assignment successful:', res);
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Success',
    //                     detail: 'Project assigned successfully.'
    //                 });
    //                 this.assignDialogVisible = false;
    //             },
    //             error: (err) => {
    //                 console.error('Assignment failed:', err);
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Error',
    //                     detail: 'Already assign project.'
    //                 });
    //             }
    //         });
    // }
assignToProject(person: any) {
    if (!this.projId) {
        console.warn('Missing project selection');
        return;
    }

    if (this.isManagerList) {
        // Assign project to manager
        if (!person?.managId) {
            console.warn('Manager ID missing');
            return;
        }
        this.adminService.assignProjectToManager(this.projId, person.managId)
            .subscribe({
                next: (res) => {
                    console.log('Project assigned to manager:', res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Project assigned to manager successfully.'
                    });
                    this.assignDialogVisible = false;
                },
                error: (err) => {
                    console.error('Assignment failed:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to assign project to manager.'
                    });
                }
            });
    } else {
        // Assign project to employee
        if (!person?.empId) {
            console.warn('Employee ID missing');
            return;
        }
        this.adminService.assignEmployeeToProject(person.empId, this.projId)
            .subscribe({
                next: (res) => {
                    console.log('Project assigned to employee:', res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Project assigned to employee successfully.'
                    });
                    this.assignDialogVisible = false;
                },
                error: (err) => {
                    console.error('Assignment failed:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to assign project to employee.'
                    });
                }
            });
    }
}


}
