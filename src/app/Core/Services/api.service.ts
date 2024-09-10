import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 apiUrl:string="http://localhost:3000";

  constructor(private http:HttpClient) { }

  loginValidation(data:any){
    return this.http.post(this.apiUrl+"/login",data);
  }
}
