import { Component } from '@angular/core'
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar'; 
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ToolbarModule , AvatarModule, DropdownModule,  FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  userOptions = [
    { label: 'My Profile', value: 'profile' },
    { label: 'Log Out', value: 'logout' }
  ];

  selectedOption: any;

  onChange(event: any) {
    if (event.value === 'profile') {
      // Navigate to profile page or perform other actions
    } else if (event.value === 'logout') {
      // Perform logout actions
    }
  }

} 
 