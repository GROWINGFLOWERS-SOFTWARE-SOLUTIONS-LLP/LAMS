import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
   FormsModule,
   RouterModule

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  loginObj:any={
    email:'',
    password:''
   }
  
   constructor(private route:Router){
  
   }
  
     loginFun(){  
        if(this.loginObj.email == 'employee@gfss.com' && this.loginObj.password == 'employee'){
         alert('login successfully')
         localStorage.setItem('logincredentials',JSON.stringify(this.loginObj));
         this.route.navigateByUrl('attendance');
        }
        if(this.loginObj.email == 'admin@gfss.com' && this.loginObj.password == 'admin'){
          alert('login successfully')
          localStorage.setItem('logincredentials',JSON.stringify(this.loginObj));
          this.route.navigateByUrl('leaverequest');}
        // else{
        //  alert('please check details ... and try again');
        // }
       
    }

}
