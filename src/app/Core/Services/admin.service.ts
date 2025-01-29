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
}
