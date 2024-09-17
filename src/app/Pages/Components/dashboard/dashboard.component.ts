import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MeterGroupModule } from 'primeng/metergroup';
import { ApiService } from '../../../Core/Services/api.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule,MeterGroupModule,],
  templateUrl: './dashboard.component.html', 
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
 


  value = [
    { label: 'Total Employees', color:'Green', value: 45 },
    { label: 'On Time', color: '#34d399', value: 18 },
    { label: 'Late In', color: '#fbbf24', value: 5 },
    { label: 'Early Exit', color: '#60a5fa', value: 6 },
    { label: 'Absent', color: '#c084fc', value: 9 }
];
value1 = [
  { label: 'Check in', color:'Green', value: 75 },
  { label: 'Not Check in', color: '#34d399', value: 25 },
  { label: 'On Leave', color: '#fbbf24', value:10 },
  { label: 'Weekly Off', color: '#60a5fa', value: 115 },
  { label: 'Check Out', color: 'red', value: 65 },
];

constructor(private apiService: ApiService) { }


}
