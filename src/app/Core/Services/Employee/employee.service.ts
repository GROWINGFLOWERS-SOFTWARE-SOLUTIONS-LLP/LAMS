import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  apiUrl: string = "http://localhost:8001";

  headers: HttpHeaders | { [header: string]: string | string[]; } | undefined;


  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/employees`, { headers: this.headers });
  }

  addEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/employee`, employee, { headers: this.headers });
  }
  updateEmployee(employee: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/employee`, employee, { headers: this.headers });
  }

  // In your ApiService
  deleteEmployee(employeeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/employee/${employeeId}`, { headers: this.headers });
  }

  getAttendanceByEmployee(employeeId: number, month: number, year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/attendance?employeeId=${employeeId}&month=${month}&year=${year}`, { headers: this.headers })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data; // ✅ Extracting only the `data`
          } else {
            throw new Error('Failed to fetch attendance data');
          }
        })
      );
  }

  //-------------------//
  getAttendanceById(employeeId: string) {
    return this.http.get(`${this.apiUrl}/attendance/${employeeId}`);
  }


  searchAttendance(data: any): Observable<any> {
    return this.http.post(this.apiUrl + "attendance/search", { headers: this.headers });
  }


  markAttendance(attendanceRecord: any) {

    return this.http.post(`${this.apiUrl}/attendance/mark`, attendanceRecord, { headers: this.headers });
  }


  getAllAttendance(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/attendance/all`);
  }




  getAllAttendanceEmployee(): Observable<any> {
  
    return this.http.get(`${this.apiUrl}/attendance/all`, { headers: this.headers });
  }

  // Holidays employee API

  getAllHolidays(): Observable<any> {

    return this.http.get(`${this.apiUrl}/admin/holidays`, { headers: this.headers });
  }
}
