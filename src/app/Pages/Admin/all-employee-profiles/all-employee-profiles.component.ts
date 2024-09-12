import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-all-employee-profiles',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './all-employee-profiles.component.html',
  styleUrl: './all-employee-profiles.component.css'
})
export class AllEmployeeProfilesComponent  {
  constructor(private route:Router){}

  addProfile(){
    this.route.navigateByUrl('profile-form');
  }
}
  
