import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  employee = {
    email: 'shubham.sonje@growingflowers-solutions.com',
    phoneNumber: '9890628672',
    // departmentId: '6', // Example ObjectId
    joiningDate: new Date('2022-01-15'),
    department: 'Engineering',
    address: 'Nashik'
  }

}
