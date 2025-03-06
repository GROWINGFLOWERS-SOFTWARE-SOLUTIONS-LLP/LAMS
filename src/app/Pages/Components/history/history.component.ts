import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';  // Import reusable LoaderComponent
import { AdminService } from '../../../Core/Services/Admin/admin.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, LoaderComponent],  // Import LoaderComponent
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  
  history: any[] = [];  // To store history data
  isLoading = false;  // To track loading state
  
  historyData: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.getHistory(); 
    
    
    

  }
  
  // Method to get history
  getHistory(){
    
        let history: any = JSON.parse(localStorage.getItem("userValue") || "null");
        console.log('History:', history);
        this.adminService.getHistory(history.empId).subscribe((data:any)=>{
            console.log('History Data:', data);
            this.historyData=data;
            this.isLoading=false;
        })
       }

// Method to delete history
deleteHistory(){
  
      let history: any = JSON.parse(localStorage.getItem("userValue") || "null");
      console.log('History :', history);
      this.adminService.deleteHistory(history.empId).subscribe((data:any)=>{
          console.log('Delete Data:', data);
          this.historyData=data;
          this.isLoading=false;
      })
     }
   }

