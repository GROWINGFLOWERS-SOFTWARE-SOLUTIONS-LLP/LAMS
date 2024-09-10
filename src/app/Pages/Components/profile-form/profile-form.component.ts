import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [AvatarModule,ButtonModule,DialogModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css'
})
export class ProfileFormComponent {
  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }

}
