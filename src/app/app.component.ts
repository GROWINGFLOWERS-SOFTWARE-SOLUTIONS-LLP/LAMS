import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeaveComponent } from './Pages/Components/leave/leave.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeaveComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LAMS';
}
