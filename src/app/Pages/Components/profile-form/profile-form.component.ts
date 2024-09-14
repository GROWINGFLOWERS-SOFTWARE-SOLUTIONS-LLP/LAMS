import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import{BrowserModule}from'@angular/platform-browser';


@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [AvatarModule,ButtonModule,DialogModule,FormsModule,BrowserModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css'
})
export class ProfileFormComponent {

  // employeeObj:any={
  //   id:1,
  //   firstname:'',
  //   lastname:'',
  //   emailaddress:'',
  //   phonenumber:'',
  //   department:'',
  //   designation:'',
  //   joiningdate:'',
  //   address:'',
 
  // }
  // currentId:number=0;
  // employeeArray:any[]=[];
 
  // constructor(private activatedRoute:ActivatedRoute){
  //  this.activatedRoute.params.subscribe((res:any)=>{
  //   if(res.id){
  //     this.currentId=res.id;
  //   }
  //  })
  // }
 
  // ngOnInit(): void {
  //   const localData = localStorage.getItem('profile');
  //   if(localData !== null){
  //     this.employeeArray=JSON.parse(localData);
  //     if(this.currentId !== 0){
  //       const currentRecord = this.employeeArray.find((m=> m.id == this.currentId));
  //       if(currentRecord != undefined){
  //         this.employeeObj=currentRecord;
  //       }
  //     }
  //   }
  // }
  // update(){
  //   const currentRecord = this.employeeArray.find((m=> m.id == this.currentId));
  //   if(currentRecord != undefined){
  //     const index = this.employeeArray.findIndex((m=> m.id == this.currentId));
  //     this.employeeArray.splice(index,1);
  //     this.employeeArray.push(this.employeeObj);
  //     localStorage.setItem('profile',JSON.stringify(this.employeeArray));
  //     alert("Updated")
  //   }
  // }
 


  // visible: boolean = false;

  // showDialog() {
  //     this.visible = true;
  // }

  // // updateProfile(){
  // //   this.route.navigateByUrl('profile');

  // }

  employees = {     firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        department: '', 
        role: '',                        
        joiningDate: '', 
        address: ''  };   
      constructor(private http: HttpClient) {} 
       onUpdate() {     // Replace with your backend URL
        const apiUrl = 'http://localhost:3000\employees';  

       this.http.post(apiUrl, this.employees).subscribe(response => { 
       console.log('employees registered successfully', response); 
       // Handle successful registration, e.g., show a message or redirect 
       }, error => { 
        console.error('Registration error', error);
         // Handle errors, e.g., show an error message
          }); 
        } 
       
        onDelete() {     // Replace with your backend URL
          const apiUrl = 'http://localhost:3000\employees';  
  
         this.http.post(apiUrl, this.employees).subscribe(response => { 
         console.log('employees deleted successfully', response); 
         // Handle successful registration, e.g., show a message or redirect 
         }, error => { 
          console.error('Registration error', error);
           // Handle errors, e.g., show an error message
            }); 
          } 
      
      }
  





