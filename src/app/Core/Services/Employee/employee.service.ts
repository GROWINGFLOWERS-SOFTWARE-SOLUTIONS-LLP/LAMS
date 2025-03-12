import { HttpClient, HttpHeaders } from '@angular/common/http';
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
 
 
  //-------------------//
 
  getAttendanceById(attendanceId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(this.apiUrl + "attendance/${attendanceId}", { headers });
  }
 
  searchAttendance(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiUrl + "attendance/search", { headers });
  }
 
 
  markAttendance(attendanceRecord: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.apiUrl}/attendance/mark`, attendanceRecord, { headers });
  }
 
 
  getAllAttendanceEmployee(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/attendance/all`, { headers });
  }
 
  // Holidays employee API

  getAllHolidays(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/admin/holidays`, { headers });
  }
}
