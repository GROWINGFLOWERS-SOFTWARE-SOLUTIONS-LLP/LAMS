import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ApiService {
 
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
 
  getHolidaysList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/publicHolidays`);
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
<<<<<<< HEAD
 // dashboard - Pending Leaves
  getLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaveBalance`);
  }
// dashboard - Total Attendance
  getAttendance(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance`);
  }
// dashboard - Total Absent
  getAbsent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/absent`);
=======

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  } 

  postUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
>>>>>>> 9e4a915068f3a0f2e1f0ecb3163c555ee61fa5d1
  }
}