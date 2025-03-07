import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class AdminService {
 
  apiUrl: string = "http://localhost:8442";
  headers: HttpHeaders | { [header: string]: string | string[]; } | undefined;
  getRoles: any;
 
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
 
  deleteHoliday(holidayId: number) {
    debugger
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete(`${this.apiUrl}/admin/holiday/${holidayId}`, { headers });
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
  
 
  // addMenus(data: any) {
  //   return this.http.post(this.apiUrl+ "/admin/roles-list", data, { headers: this.headers });
  // }
 
// Add Menus Api  
// Add Department
addDepartment(data: any) {
return this.http.post(`${this.apiUrl}/admin/department`, data, { headers: this.headers });
}
 
// Get All Departments
getAllDepartments() {
  return this.http.get(`${this.apiUrl}/admin/departments`, { headers: this.headers });
}
 
// Update Department
updateDepartment(data: any) {
  return this.http.put(`${this.apiUrl}/admin/department`, data, { headers: this.headers });
}
 
// Delete Department
deleteDepartment(roleId: number) {
  return this.http.delete(`${this.apiUrl}/admin/department/${roleId}`, { headers: this.headers });
}
 
// Roles CRUD Operations
addRole(data: any) {
  return this.http.post(`${this.apiUrl}/admin/role`, data, { headers: this.headers });
}
 
// Get All Roles
getAllRoles() {
  return this.http.get(`${this.apiUrl}/admin/roles`, { headers: this.headers });
}
 
// Update Role
updateRole(data: any) {
  return this.http.put(`${this.apiUrl}/admin/role`, data, { headers: this.headers });
}
// Delete Role
deleteRole(roleId: number) {
  return this.http.delete(`${this.apiUrl}/admin/role/${roleId}`, { headers: this.headers });
}
 
// Manager CRUD Operations
// Add Manager
addManager(data: any) {
  return this.http.post(`${this.apiUrl}/admin/manager`, data, { headers: this.headers });
}
 
// Get All Managers
getAllManagers() {
  return this.http.get(`${this.apiUrl}/admin/managers`, { headers: this.headers });
}
 
// Update Manager
updateManager(data: any) {
  return this.http.put(`${this.apiUrl}/admin/manager`, data, { headers: this.headers });
}
 
// Delete Manager
deleteManager(id: number) {
  return this.http.delete(`${this.apiUrl}/admin/manager/${id}`, { headers: this.headers });
}
 
// Project CRUD Operations
// Add project
addProject(data: any) {
  return this.http.post(`${this.apiUrl}/admin/project`, data, { headers: this.headers });
}
 
// Assign Employee To Project
assignEmployeeToProject(projectId: number, employeeId: number, data: any) {
  return this.http.post(`${this.apiUrl}/admin/project/${projectId}/assign/${employeeId}`, data, { headers: this.headers });
}
 
// Get all Projects
getAllProjects() {
    return this.http.get(`${this.apiUrl}/admin/project`, { headers: this.headers });
  }
 
// Get Employees in Project
getEmployeesInProject(id: number) {
  return this.http.get(`${this.apiUrl}/admin/project/${id}/employees`, { headers: this.headers });
}
 
// Get Project Details
getProjectDetails(id: number) {
  return this.http.get(`${this.apiUrl}/admin/project/${id}`, { headers: this.headers });
}
 
// Update Project
updateProject(data: any) {
  return this.http.put(`${this.apiUrl}/admin/project`, data, { headers: this.headers });
}
 
// Delete Project
deleteProject(id: number) {
  return this.http.delete(`${this.apiUrl}/admin/project/${id}`, { headers: this.headers });
}


   //API for GET History
   getHistory(history:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Components/history/${history}`);
  }


 //API for Delete Histoy
 deleteHistory(history:any): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/Components/history/${history}`);
}
 
}