import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ToolbarModule, AvatarModule, OverlayPanelModule, ButtonModule, CommonModule, RouterModule, FooterComponent], // Include RouterModule here
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAdmin: boolean = false;

  loginCredentials: any = {};

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkUserRole();
  }

  checkUserRole() {
    const loginData = localStorage.getItem('logincredentials');
    if (loginData) {
      const user = JSON.parse(loginData);
      this.loginCredentials = user;
      console.log(this.loginCredentials);
      this.isAdmin = user.email === 'admin@gfss.com';
    }
  }

  toggleDropdown(event: Event, overlayPanel: any) {
    overlayPanel.toggle(event);
  }

  navigateTo(route: string) {
    if (route === 'profile') {
      this.router.navigate(['/profile']);
    } else if (route === 'logout') {
      localStorage.removeItem('logincredentials');
      this.router.navigate(['/login']);
    }
  }
}
