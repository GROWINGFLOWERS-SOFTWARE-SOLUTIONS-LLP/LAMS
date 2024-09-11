import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

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

  getTotalEmployees(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
  getEmployees(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  

}

