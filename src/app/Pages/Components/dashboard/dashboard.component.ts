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

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CardModule,
        ProgressSpinnerModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        TableModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
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
    activeProjectsCount =0;
    selectedProject: any = null;
    isProjectListVisible = false;
    selectedEmployee: any = { employee: null, role: '', manager: null };
    employees: any[] = [];
    managers: any[] = [];
    currentProjectName: string = '';
    dashboard: any;
    dashboardData: any;

    constructor(private apiService: ApiService,private adminService: AdminService) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.getDashbaordData();
        this.loadProjects(); // Load and count active projects
    }

    loadProjects(): Promise<void> {
        return new Promise(resolve => {
            this.adminService.getAllProjectsList().subscribe((projects: any) => {
                this.projects = projects.data;
                console.log('Projects:', this.projects);
                // Count only active projects
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
}
