import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../../Core/Services/auth.service';

@Component({
  selector: 'app-navbar', 
  standalone: true,
  imports: [ToolbarModule, AvatarModule, OverlayPanelModule, ButtonModule, CommonModule, RouterModule, FooterComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] 
}) 
export class NavbarComponent implements OnInit {
  isAdmin: boolean = false;
  isManager: boolean = false;
  isEmployee: boolean = false;

  // Define nav items for each role
  adminItems: any[] = [
    { label: 'Attendance', link: 'allattendance' },
    { label: 'Profile', link: 'employeeprofile' },
    { label: 'Manage Holidays', link: 'manageHolidays' }
  ];

  employeeItems: any[] = [
    { label: 'Dashboard', link: 'dashboard' },
    { label: 'Attendance', link: 'attendance' },
    { label: 'Leave', link: 'leave' },
    { label: 'Holidays', link: 'holidays' },
    { label: 'History', link: 'history' },
    { label: 'Help', link: 'help' }
  ];

  managerItems: any[] = [
    { label: 'Leave Request', link: 'managerRequest' }
  ];

  
  navItems: any[] = [];

  loginCredentials: any = {};

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.checkUserRole();
  }

  checkUserRole() {
    const loginData = localStorage.getItem('users');
    if (loginData) {
      const user = JSON.parse(loginData);
      this.loginCredentials = user;

      switch (this.loginCredentials.role) {
        case 'Admin':
          this.isAdmin = true;
          this.navItems = [...this.adminItems];
          break;
        case 'Manager':
          this.isManager = true;
          this.navItems = [...this.managerItems];
          break;
        case 'Employee':
          this.isEmployee = true;
          this.navItems = [...this.employeeItems];
          break;
        default:
          this.navItems = [];
      }
    }
  }

  toggleDropdown(event: Event, overlayPanel: any) {
    overlayPanel.toggle(event);
  }

  navigateTo(route: string) {
    if (route === 'profile') {
      this.router.navigate(['/profile']);
    } else if (route === 'logout') {
      this.authService.logout();
      localStorage.removeItem('users');
      this.router.navigate(['/login']);
    }
  }
} 
