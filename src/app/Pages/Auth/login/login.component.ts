import { Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../Core/Services/api.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;


  constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder) {
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
    this.apiService.getUsers().subscribe((data) => {
     
      let users = data.find((user: any) => user.username === this.loginForm.value.email && user.password === this.loginForm.value.password);
      localStorage.setItem('users', JSON.stringify(users));
      this.roleBasedRouting(users);
    });
  }

  roleBasedRouting(users: any) {
    debugger;
    if (users.role === 'Admin') {
      this.router.navigate(['/employeeprofile']);
    } else if (users.role === 'Employee') {
      this.router.navigate(['/attendance']);
    } else if (users.role === 'Manager') {
      this.router.navigate(['/managerRequest']);
    }
    else{
      this.router.navigate(['/login']);
    }
  }
}
