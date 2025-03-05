import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/Services/api.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
 
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AvatarModule, ButtonModule, DatePipe],
})
export class ProfileFormComponent implements OnInit {
  employee: any;
 
  constructor(private apiService: ApiService, private router: Router) { }
 
  ngOnInit(): void {
    // this.employee = this.apiService.getLoggedInUser();
  }
 
  onSubmit(form: any) {
    if (form.valid) {
      this.apiService.updateUserProfile(this.employee).subscribe(response => {
        // Handle success response
        alert('Profile updated successfully');
        this.router.navigateByUrl('profile');
      }, error => {
        // Handle error response
        console.error('Error updating profile', error);
      });
    }
  }
}