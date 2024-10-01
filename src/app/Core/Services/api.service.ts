import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  getLeaveBalance(id: any) {
    throw new Error('Method not implemented.');
  }
 
  apiUrl:string="http://localhost:3000";
 
  constructor(private http:HttpClient) { }
 
  loginValidation(data:any){
    return this.http.post(this.apiUrl+"/login",data);
  }
 
  postAttendance(attendanceRecord: any){
    return this.http.post(this.apiUrl + "/attendance", attendanceRecord);
  }
 
  // Method to get leave requests from the backend API
  getLeaveRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaveApplications`);
  }
 
  // Method to submit a leave request to the backend API
  submitLeaveRequest(leaveRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leaveApplications`, leaveRequest);
  }
  // Method to get the list of holidays
  getHolidaysList(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/publicHolidays`);
  }


  addEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees`, employee);
  }
 
  updateEmployee(employee: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/employees/${employee.id}`, employee);
  }
 
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/employees/${id}`);
  }
 
  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employees`);
  }
 
  // dashboard - get employees number
  getEmployee(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employees`);
  }

  addHoliday(holiday: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/publicHolidays`, holiday);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  } 

  postUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  //dashboard - Total Attendance
  getAttendance(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance`);
  }
  //dashboard - Total Absent
  getAbsent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/absent`);
  }

  // Method to delete a holiday
  deleteHoliday(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/publicHolidays/${id}`);
  }

  // Method to update a holiday (optional if needed for editing)
  updateHoliday(holiday: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/publicHolidays/${holiday.id}`, holiday);
  }

  // dashboard- Remaining Leaves
  getLeavedata(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Leavedata`);
  }
}