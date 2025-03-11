import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  apiUrl: string = "http://localhost:8442";

  headers: HttpHeaders | { [header: string]: string | string[]; } | undefined;

  
  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/employees`,{ headers: this.headers });
  }

  addEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/employee`, employee,{ headers: this.headers });
  }
  updateEmployee(employee: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/employee`, employee,{ headers: this.headers });
  }

  // In your ApiService
  deleteEmployee(employeeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/employee/${employeeId}`,{ headers: this.headers });
  }




  // Method to get leave requests from the backend API
  getLeaveRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaveApplications`);
  }

  getAttendanceByEmployee(month: number, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance?employeeId=${123}&month=${month}&year=${year}`);
  }
}
