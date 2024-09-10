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
  
}
