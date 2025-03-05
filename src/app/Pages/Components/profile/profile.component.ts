import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../Core/Services/api.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule, DatePipe } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, ButtonModule, CardModule, CommonModule, DatePipe, LoaderComponent],  
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  employee: any;
  loading: boolean = false;  // Add a loading state

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {                                                                    
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;  // Start loading before fetching the data
    let employeeId: any = JSON.parse(localStorage.getItem("userValue") || "null");
      this.employee = this.apiService.getProfile(employeeId.empId).subscribe((data:any) => {
        console.log('Profile Data: ', data);
      });
      this.loading = false;  // Stop loading when data is fetched
   
  }

  updateProfile() {
    this.router.navigateByUrl('profile-form');
  }
}
