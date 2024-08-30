import { Component } from '@angular/core';
<<<<<<< HEAD
import { HistoryComponent } from './Pages/Components/history/history.component';
=======
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Pages/Layout/navbar/navbar.component';
import { HelpComponent } from './Pages/Components/help/help.component';
import { AttendanceComponent } from './Pages/Components/attendance/attendance.component';
import { LeaveComponent } from './Pages/Components/leave/leave.component';

import { HolidaysComponent } from './Pages/Components/holidays/holidays.component';
>>>>>>> b4eeccf44611c74bd8b68ae3663e636b2f303316

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [HistoryComponent],
=======
  imports: [RouterOutlet, LeaveComponent,HolidaysComponent,AttendanceComponent,NavbarComponent, HelpComponent],
>>>>>>> b4eeccf44611c74bd8b68ae3663e636b2f303316
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LAMS';
}
