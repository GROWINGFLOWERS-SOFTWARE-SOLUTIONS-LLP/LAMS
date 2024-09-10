
import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ToolbarModule, AvatarModule, OverlayPanelModule, ButtonModule, RouterModule, CommonModule,FooterComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router) {}

  toggleDropdown(event: Event, overlayPanel: any) {
    overlayPanel.toggle(event);
  }

  navigateTo(route: string) { 
    if (route === 'profile') {
      this.router.navigate(['/profile']);
    } else if (route === 'logout') {
      localStorage.removeItem('logincredentials');
      this.router.navigate(['/login'])
      
    }
  }
}

