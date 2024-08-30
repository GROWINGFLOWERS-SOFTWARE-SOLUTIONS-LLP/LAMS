import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AttendanceComponent } from './Pages/Components/attendance/attendance.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AttendanceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LAMS';
}
