import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Core/Services/Admin/admin.service';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  historyData: any[] = [];
  isLoading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getHistory(); 
  }

  getHistory() {
    const user = JSON.parse(localStorage.getItem("userValue") || "null");
    if (!user?.empId) {
      this.isLoading = false;
      return;
    }

    this.adminService.getHistory(user.empId).subscribe({
      next: (data: any) => {
        this.historyData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch history:', err);
        this.isLoading = false;
      }
    });
  }

  hasHistory(): boolean {
    return this.historyData && this.historyData.length > 0;
  }
}
