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

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CardModule, ProgressSpinnerModule, CommonModule, ButtonModule, DialogModule, DropdownModule, FormsModule,TableModule],
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
    activeProjectsCount = 0;
    selectedProject: any = null;
    isProjectListVisible = false;
    selectedEmployee: any = { employee: null, role: '', manager: null }; 
    employees: any[] = []; 
    managers: any[] = [];
    currentProjectName: string = '';
     
    dashboardData:any;
    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.getDashbaordData()
       
    }

    private loadProjects(): Promise<void> {
        return new Promise(resolve => {
            this.apiService.getProjects().subscribe((projects: any[]) => {
                this.projects = projects;
                this.activeProjectsCount = projects.length;
                resolve();
            });
        });
    }

    

    showProjectDetails(project: any): void {
        console.log(project);
        this.selectedProject = project;
    }

    // Method to show the "Assign Project" form
    showAssignProjectForm(projectName: string) {
        this.currentProjectName = projectName;
        this.isProjectListVisible = true;
    }

    assignProjectToEmployee() {
        console.log('Assigned Employees:', this.selectedEmployee);
        this.isProjectListVisible = false;
    }

    getDashbaordData(){
        debugger;
        let employeeId: any = JSON.parse(localStorage.getItem("userValue") || "null");
        console.log('Employee Id:', employeeId);
        this.apiService.getDashboard(employeeId.empId).subscribe((data:any)=>{
            console.log('Dashboard Data:', data);
            this.dashboardData=data;
            this.isLoading=false;
        })
       }
}
