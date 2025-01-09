import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiUrl: string = "http://localhost:8442";

  constructor(private http: HttpClient) {

   }

  loginValidation(data: any) {
    debugger
     const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiUrl + "/auth/login", data,{headers});
  }
}
