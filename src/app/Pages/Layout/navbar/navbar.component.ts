import { Component } from '@angular/core';

import { ToolbarModule } from 'primeng/toolbar';

import { AvatarModule } from 'primeng/avatar'; 
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ToolbarModule , AvatarModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
 