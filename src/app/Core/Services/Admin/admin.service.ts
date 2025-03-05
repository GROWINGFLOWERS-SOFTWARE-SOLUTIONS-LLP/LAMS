import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiUrl: string = "http://localhost:8442";

  constructor(private http: HttpClient) {

   }
// Login Api
  loginValidation(data: any) {
    
     const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiUrl + "/auth/login", data,{headers});
  }
// Change Password Api
  changePassword(data: any) {
     const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiUrl + "/auth/cp", data,{headers});
  }

  // Holidays Api methods
 
  createHoliday(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiUrl + "/admin/holiday", data, { headers });
  }
 
  getAllHolidaysList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(this.apiUrl + "/admin/holidays", { headers });
  }
 
  updateHoliday( data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(this.apiUrl + "/admin/holiday" , data, { headers });
  }
 
  deleteHoliday(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete(`${this.apiUrl}/admin/holiday/${id}`, { headers });
  }
  
// Attendance api methods
 
createAttendance(data: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.post(this.apiUrl + "/admin/attendance", data, { headers });
}
 
getAllAttendance() {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.get(this.apiUrl + "/admin/attendance/all", { headers });
}
  
}
