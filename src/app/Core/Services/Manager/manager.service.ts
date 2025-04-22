import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  apiURL: string = "http://localhost:8442";

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

  applyLeave(data: any){
    return this.http.post(`${this.apiURL}/api/leave/apply`, data, {headers: this.headers});
  }

  geEmployeeleave(id:any){
    return this.http.get(`${this.apiURL}/api/leave/employee/${id}`, {headers: this.headers});
  }

  getAllPendingLeaves(){
    return this.http.get(`${this.apiURL}/api/leave/pending`, {headers: this.headers});
  }
  
  approveLeave(employeeId:any){
    return this.http.put(`${this.apiURL}/api/leave/${employeeId}/approve`, {headers: this.headers});
  }

  rejectLeave(employeeId:any){
    return this.http.put(`${this.apiURL}/api/leave/${employeeId}/reject`, {headers: this.headers});
  }


}
