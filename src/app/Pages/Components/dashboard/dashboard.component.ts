import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MeterGroupModule } from 'primeng/metergroup';

// Define interfaces for better type safety
interface MeterValue {
  label: string;
  color: string;
  value: number;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule,MeterGroupModule,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  
  totalEmp: any[] = [];  //initialized with actual data
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
ngOnInit(): void {
  // Initialize totalEmp with some data
  this.totalEmp = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Shweta' },
    { id: 4, name: 'Prajakta' },
    { id: 5, name: 'Shubham' },
    { id: 6, name: 'Bhushan' },
    { id: 7, name: 'Sahil' },
    { id: 8, name: 'Zaid' },
    { id: 9, name: 'Abhishek' },
    { id: 10, name: 'Aditya' },
    { id: 11, name: 'Smith' },
    { id: 12, name: 'Jane Smith' },
    { id: 13, name: 'John Doe' },
    { id: 14, name: 'Jane' },
    { id: 15, name: 'John' },
    { id: 16, name: 'Jane Smith' },
    { id: 17, name: 'John Doe' },
    { id: 18, name: 'Jane Smith' },
    { id: 19, name: 'John Doe' },
    { id: 20, name: 'Jane Smith' },
    
    // Add more employee data as needed
  ];
  
  // Update total employees count
  this.updateTotalEmployees();
}

// Method to calculate and update total number of employees
updateTotalEmployees(): void {
  const total = this.totalEmp.length;
  // Find the meter value with the label 'Total Employees' and update its value
  const totalEmployees = this.value.find(v => v.label === 'Total Employees');
  if (totalEmployees) {
    totalEmployees.value = total;
  }
}
}

