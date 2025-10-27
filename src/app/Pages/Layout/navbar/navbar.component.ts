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
import { MenuItem } from 'primeng/api';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from 'primeng/megamenu';
import { SidebarModule } from 'primeng/sidebar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ManagerService } from '../../../Core/Services/Manager/manager.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ToolbarModule, AvatarModule, OverlayPanelModule, ButtonModule, CommonModule, RouterModule, SidebarModule, TieredMenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen: boolean = false;

  isScreenSmall(): boolean {
    return window.innerWidth < 1024;
  }
  notifications: any[] = [];
  notificationCount: number = 0;

  onNotificationsClick() {

  }

  sidebarVisible: boolean = false;
  isScreenMdOrLarger(): boolean {
    return this.breakpointObserver.isMatched('(min-width: 768px)');
  }

  isEmployee: boolean = false;
  accountItems: MenuItem[] = [];
  adminItems: any[] = [
    { label: 'Dashboard', link: 'dashboard', icon: 'pi pi-home' },
    { label: 'Attendance', link: 'allattendance', icon: 'pi pi-calendar' },
    { label: 'Employees', link: 'employeeprofile', icon: 'pi pi-users' },
    { label: 'H-Manage', link: 'manageHolidays', icon: 'pi pi-calendar-times' },
    { label: 'M-Request', link: 'manager-leave-request', icon: 'pi pi-file' },
    { label: 'Add Roles', link: 'roleslist', icon: 'pi pi-user-edit' },
    { label: 'Notification', link: 'notification', icon: 'pi pi-bell' },

  ];

  employeeItems: any[] = [
    { label: 'Dashboard', link: 'dashboard', icon: 'pi pi-home' },
    { label: 'Attendance', link: 'attendance', icon: 'pi pi-calendar' },
    { label: 'Leave', link: 'leave', icon: 'pi pi-briefcase' },
    { label: 'Holidays', link: 'holidays', icon: 'pi pi-calendar-times' },
    { label: 'Help', link: 'help', icon: 'pi pi-info-circle' }
  ];

  managerItems: any[] = [
    { label: 'Dashboard', link: 'dashboard', icon: 'pi pi-home' },
    { label: 'Attendance', link: 'attendance', icon: 'pi pi-calendar' },
    { label: 'L-Request', link: 'managerRequest', icon: 'pi pi-file' },
    { label: 'Leave', link: 'leave', icon: 'pi pi-briefcase' },
    { label: 'Holidays', link: 'holidays', icon: 'pi pi-calendar-times' },
    { label: 'Notification', link: 'notification', icon: 'pi pi-bell' },
    { label: 'Help', link: 'help', icon: 'pi pi-info-circle' }
  ];


  navItems: any[] = [];

  loginCredentials: any = {};

  constructor(private router: Router, private authService: AuthService, private breakpointObserver: BreakpointObserver, private managerService: ManagerService) { }

  ngOnInit() {
    this.checkUserRole();
    this.fetchNotifications();
  }

  fetchNotifications() {
  this.managerService.getAllNotifications().subscribe({
    next: (response: any) => {
      console.log('Notification API Response:', response);
      const allNotifications = response.data || response;

      const today = new Date();
      today.setHours(0, 0, 0, 0); // start of today

      // Filter upcoming notifications
      this.notifications = allNotifications
        .filter((notif: any) => {
          const notifDate = new Date(notif.date);
          notifDate.setHours(0, 0, 0, 0);
          return notifDate >= today;
        })
        .sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

      this.notificationCount = this.notifications.length;
    },
    error: (error) => {
      console.error("Failed to load notifications", error);
    }
  });
}

onNotificationClick(event: Event, overlay: any) {
  this.fetchNotifications();   // 🔄 refresh list before opening
  overlay.toggle(event);
}


  checkUserRole() {
    const loginData = localStorage.getItem('userValue');
    if (loginData) {
      const user = JSON.parse(loginData);
      this.loginCredentials = user;

      switch (this.loginCredentials.role) {
        case 'Admin':
          this.navItems = [...this.adminItems];
          break;
        case 'Manager':
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
      localStorage.removeItem('userValue');
      this.router.navigate(['/login']);
    }
  }
} 
