import { Routes } from '@angular/router';
import { LeaveComponent } from './Pages/Components/leave/leave.component';
import { HolidaysComponent } from './Pages/Components/holidays/holidays.component';
import { NavbarComponent } from './Pages/Layout/navbar/navbar.component';
import { HistoryComponent } from './Pages/Components/history/history.component';
import { HelpComponent } from './Pages/Components/help/help.component';
import { AttendanceComponent } from './Pages/Components/attendance/attendance.component';

export const routes: Routes = [
    {
        path: '',
        component: NavbarComponent,
        children: [
            // { path: 'dashboard', component: },
            { path: 'attendance', component: AttendanceComponent },
            { path: 'leave', component: LeaveComponent },
            { path: 'holidays', component: HolidaysComponent }, 
            { path: 'history', component: HistoryComponent }, 
            { path: 'help', component: HelpComponent }, 
        ]
    }
];
