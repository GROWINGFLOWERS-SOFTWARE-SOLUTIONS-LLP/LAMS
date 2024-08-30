import { Component } from '@angular/core';

import { ToolbarModule } from 'primeng/toolbar';

import { AvatarModule } from 'primeng/avatar'; 


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ToolbarModule , AvatarModule,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
 