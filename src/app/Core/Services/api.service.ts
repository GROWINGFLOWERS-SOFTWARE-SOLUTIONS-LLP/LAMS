import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';

 
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  
  apiUrl: string = "http://localhost:8442";
 
   headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  
  constructor(private http: HttpClient) { }
 
 
  postAttendance(attendanceRecord: any) {
    return this.http.post(this.apiUrl + "/attendance", attendanceRecord);
  }
 
 
 
  // Method to submit a leave request to the backend API
  submitLeaveRequest(leaveRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leaveApplications`, leaveRequest);
  }
 
  // Method to get the list of holidays
  getHolidaysList(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/publicHolidays`);
  }
 
  // Method to add the  holidays
  addHoliday(holiday: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/publicHolidays`, holiday);
  }
 
  // Method to delete a holiday
  deleteHoliday(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/publicHolidays/${id}`);
  }
 
  // Method to update a holiday
  updateHoliday(holiday: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/publicHolidays/${holiday.id}`, holiday);
  }
 
  // dashboard - get employees number
  getEmployee(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employees`);
  }
 
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }
 
  postUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }
 
  //dashboard - Remaining Leaves
  getLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaveBalance`);
  }

     // Method to get leave requests from the backend API
     getLeaveRequests(): Observable<any> {
      return this.http.get(`${this.apiUrl}/leaveApplications`);
    }
 
  //dashboard - Total Attendance
  getAttendance(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance`);
  }
 
  //dashboard - Total Absent
  getAbsent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/absent`);
  }
 
  //dashboard - Leaves Taken
  getLeavesTaken(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leavesTaken`);
  }
 
  // dashboard- Remaining Leaves
  getLeavedata(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Leavedata`);
  }
 
  // Get the logged-in user details
  updateUserProfile(updatedUser: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/employees/${updatedUser.id}`, updatedUser);
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }

  addProject(project: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects`, project);
  }

  updateProject(project: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${project.id}`, project);
  }

  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${projectId}`);
  }
 

  //  Api for Dashboard 
  getDashboard(id:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Dashboard/summary/${id}`);
  }

  //  Api for Profile
  getProfile(id:any): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/profile/${id}`, {headers: this.headers});
  }

  

}
 