import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  apiUrl: string = "http://localhost:8442";
  
  constructor(private http: HttpClient) {

   }

   addEmployee(employee: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/employees`, employee);
    }
    updateEmployee(employee: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/employees/${employee.id}`, employee);
    }
   
    // In your ApiService
    deleteEmployee(employeeId: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/employees/${employeeId}`);
    }
   
    getEmployees(): Observable<any> {
      return this.http.get(`${this.apiUrl}/employees`);
    }


     // Method to get leave requests from the backend API
  getLeaveRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaveApplications`);
  }

  getAttendanceByEmployee( month: number, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance?employeeId=${123}&month=${month}&year=${year}`);
  }
}
