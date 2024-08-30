import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AttendanceComponent } from './Pages/Components/attendance/attendance.component';
import { LeaveComponent } from './Pages/Components/leave/leave.component';

import { HolidaysComponent } from './Pages/Components/holidays/holidays.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeaveComponent,HolidaysComponent,AttendanceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LAMS';
}
