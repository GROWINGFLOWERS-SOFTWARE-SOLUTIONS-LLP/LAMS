import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../Core/Services/api.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, ButtonModule, CardModule, CommonModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  employee: any;
  loading: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    const user = JSON.parse(localStorage.getItem('userValue') || 'null');
    if (user?.empId) {
      this.apiService.getProfile(user.empId).subscribe((data: any) => {
        this.employee = data;
        this.loading = false;
      });
    }
  }

  updateProfile() {
    // this.router.navigateByUrl('profile-form', { state: { employee: this.employee } });
    this.router.navigate(['profile-form']);
  }
  
}
