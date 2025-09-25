import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


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



  //dashboard - Total Attendance
  getAttendance(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance`);
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
  getDashboard(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Dashboard/summary/${id}`);
  }

  //  Api for Profile
  getProfile(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Employee/${id}`, { headers: this.headers });
  }


  updateProfile(profile: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Employee/update`, profile); // update with correct endpoint
  }


  deleteProfile(id: any): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/Employee/delete/${id}`, { headers: this.headers });
  }

}
