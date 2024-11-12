import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../../Core/Services/api.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CardModule, ProgressSpinnerModule, CommonModule, ButtonModule, DialogModule, DropdownModule, FormsModule], 
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
    selectedEmployee: any = { employee: null, role: '', manager: null }; // Initialize selectedEmployee
    employees: any[] = []; // Available employees for assignment
    managers: any[] = [];  // List of managers

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.isLoading = true;

        Promise.all([
            this.loadTotalEmployees(),
            this.loadTotalAttendance(),
            this.loadTotalAbsent(),
            this.loadLeaveData(),
            this.loadProjects(),
            this.loadEmployees(),
            this.loadManagers() // Load managers
        ]).then(() => {
            setTimeout(() => {
                this.isLoading = false;
            }, 2000);
        });

        const loggedInUser = this.apiService.getLoggedInUser();
        if (loggedInUser) {
            this.loggedInUserName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
        }
    }

    private loadTotalEmployees(): Promise<void> {
        return new Promise(resolve => {
            this.apiService.getEmployee().subscribe(employee => {
                this.totalEmployees = employee.length;
                resolve();
            });
        });
    }

    private loadTotalAttendance(): Promise<void> {
        return new Promise(resolve => {
            this.apiService.getAttendance().subscribe(attendance => {
                this.totalAttendance = attendance.length;
                resolve();
            });
        });
    }

    private loadTotalAbsent(): Promise<void> {
        return new Promise(resolve => {
            this.apiService.getAbsent().subscribe(absent => {
                this.absent = absent.length;
                resolve();
            });
        });
    }

    private loadLeaveData(): Promise<void> {
        return new Promise(resolve => {
            this.apiService.getLeavedata().subscribe((Leavedata: any) => {
                this.totalLeaves = Leavedata.totalLeaves;
                this.leavesTaken = Leavedata.leavesTaken;
                this.calculateRemainingLeaves();
                resolve();
            });
        });
    }

    private calculateRemainingLeaves(): void {
        this.remainingLeaves = this.totalLeaves - this.leavesTaken;
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

    private loadEmployees(): Promise<void> {
        return new Promise(resolve => {
            this.apiService.getEmployee().subscribe((employees: any[]) => {
                this.employees = employees.map(emp => ({
                    ...emp,
                    fullName: `${emp.firstName} ${emp.lastName}`  // Combine first and last name
                }));
                resolve();
            });
        });
    }

    private loadManagers(): Promise<void> {
        return new Promise(resolve => {
            this.managers = this.employees.filter(emp => emp.role === 'Manager');
            resolve();
        });
    }

    showProjectDetails(project: any): void {
        this.selectedProject = { ...project, assignedEmployees: [] }; 
    }

    showProjectList() {
        this.isProjectListVisible = true;
    }

    assignProjectToEmployee() {
        console.log('Assigned Employees:', this.selectedEmployee); 
        // Logic to update the project assignments
    }
}