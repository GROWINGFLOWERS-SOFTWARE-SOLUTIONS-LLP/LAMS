import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, ButtonModule,CardModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private route:Router){}

  employee = {
    email: 'shubham.sonje@growingflowers-solutions.com',
    phoneNumber: '9890628672',
    // departmentId: '6', // Example ObjectId
    joiningDate: new Date('2022-02-16'),
    department: 'Engineering',
    address: 'Nashik'
  }


  updateProfile(){
    this.route.navigateByUrl('profile-form');
  }

}
