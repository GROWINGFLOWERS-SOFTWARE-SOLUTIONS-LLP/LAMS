import { Component } from '@angular/core';
import { HistoryComponent } from './Pages/Components/history/history.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Pages/Layout/navbar/navbar.component';
import { HelpComponent } from './Pages/Components/help/help.component';
import { AttendanceComponent } from './Pages/Components/attendance/attendance.component';
import { LeaveComponent } from './Pages/Components/leave/leave.component';
import { FooterComponent } from './Pages/Layout/footer/footer.component';
import { HolidaysComponent } from './Pages/Components/holidays/holidays.component';
import { DashboardComponent } from './Pages/Components/dashboard/dashboard.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeaveComponent,HolidaysComponent,AttendanceComponent,NavbarComponent, HelpComponent,HistoryComponent,DashboardComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LAMS';
}
