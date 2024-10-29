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
    setTimeout(() => {  // Simulate delay for fetching the data (Replace this with real API call)
      this.employee = this.apiService.getLoggedInUser();
      this.loading = false;  // Stop loading when data is fetched
    }, 2000);
  }

  updateProfile() {
    this.router.navigateByUrl('profile-form');
  }
}
