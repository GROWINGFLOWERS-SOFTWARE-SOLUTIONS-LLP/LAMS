import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../Core/Services/api.service';
import { FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj: any = {
    email: '',
    password: '',
    role: ''
  };


  loginForm;


  constructor(private route: Router, private apiService:ApiService,private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() { return this.loginForm.controls['password']; }

  loginFun() {  
    if (this.loginObj.email === 'employee@gfss.com' && this.loginObj.password === 'employee') {
      alert('Login successful');
      localStorage.setItem('logincredentials', JSON.stringify(this.loginObj));
      this.route.navigateByUrl('attendance');
    } else if (this.loginObj.email === 'admin@gfss.com' && this.loginObj.password === 'admin') {
      alert('Login successful');
      localStorage.setItem('logincredentials', JSON.stringify(this.loginObj));
      this.route.navigateByUrl('leaverequest');
    } else {
      alert('Please check details and try again');
    }
  }
 
    
}
