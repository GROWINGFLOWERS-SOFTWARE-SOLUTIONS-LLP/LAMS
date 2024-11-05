import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../../Core/Services/api.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CardModule, ProgressSpinnerModule, CommonModule],
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
    isLoading = true; // Loader state

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        // Show loader initially and start data loading
        this.isLoading = true;

        // Start loading all data
        Promise.all([
            this.loadTotalEmployees(),
            this.loadTotalAttendance(),
            this.loadTotalAbsent(),
            this.loadLeaveData()
        ]).then(() => {
            // Set a 2-second timer before hiding the loader
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
}
