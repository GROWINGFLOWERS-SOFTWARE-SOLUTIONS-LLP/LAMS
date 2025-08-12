import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiUrl: string = "http://localhost:8442";
  headers: HttpHeaders | { [header: string]: string | string[]; } | undefined;

  constructor(private http: HttpClient) {
 this.headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // 'Authorization': 'Bearer your-token' // Uncomment and use if needed
    });
  }
  // Login Api
  loginValidation(data: any) {
   
    return this.http.post(this.apiUrl + "/auth/login", data, { headers: this.headers });
  }
  // Change Password Api
  changePassword(data: any) {
 
    return this.http.post(this.apiUrl + "/auth/cp", data, { headers: this.headers });
  }

  // Holidays Api methods
  createHoliday(data: any) {

    return this.http.post(this.apiUrl + "/admin/holiday", data, { headers: this.headers});
  }

  getAllHolidaysList() {
  
    return this.http.get(this.apiUrl + "/admin/holidays", { headers: this.headers });
  }

  updateHoliday(data: any) {
 
    return this.http.put(this.apiUrl + "/admin/holiday", data, { headers: this.headers});
  }

  deleteHoliday(id: number) {
    
    return this.http.delete(`${this.apiUrl}/admin/holiday/${id}`, { headers:this.headers});
  }

  // Attendance api methods

  createAttendance(data: any) {
   
    return this.http.post(this.apiUrl + "/admin/attendance", data, { headers: this.headers });
  }

  getAllAttendance() {
   
    return this.http.get(this.apiUrl + "/admin/attendance/all", { headers:this.headers });
  }

  // Add Menus Api  
  // Add Department
  createDepartment(data: any) {
 
    return this.http.post(this.apiUrl + "/admin/department", data, { headers: this.headers});
  }

  // Get All Departments
  getAllDepartmentsList() {
  
    return this.http.get(this.apiUrl + "/admin/departments", { headers: this.headers });
  }

  // Update Department
  updateDepartment(data: any) {
   
    return this.http.put(this.apiUrl + "/admin/department", data, { headers: this.headers });
  }

  // Delete Department
  deleteDepartment(depId: string) {
  
    return this.http.delete(`${this.apiUrl}/admin/department/${depId}`, { headers: this.headers });

  }

  // Get All Roles
  getAllRolesList() {
 
    return this.http.get(this.apiUrl + "/admin/roles", { headers: this.headers });
  }
  
  // Roles CRUD Operations
  createRole(data: any) {

    return this.http.post(this.apiUrl + "/admin/role", data, { headers: this.headers});
  }

  // Update Role
  updateRole(data: any) {
 
    return this.http.put(this.apiUrl + "/admin/role", data, { headers: this.headers});
  }

  // Delete Role
  deleteRole(rolId: string) {
    
    return this.http.delete(`${this.apiUrl}/admin/role/${rolId}`, { headers: this.headers});
  }

  // Manager CRUD Operations
  // Add Manager
  createManager(data: any) {
   
    return this.http.post(`${this.apiUrl}/admin/manager`, data, { headers: this.headers });
  }

  // Get All Managers
  getAllManagersList() {
  
    return this.http.get(this.apiUrl + "/admin/managers", { headers: this.headers});
  }

  // Update Manager
  updateManager(data: any) {
   
    return this.http.put(this.apiUrl + "/admin/manager", data, { headers: this.headers});
  }

  // Delete Manager
  deleteManager(managId: string) {
  
    return this.http.delete(`${this.apiUrl}/admin/manager/${managId}`, { headers: this.headers });

  }

  // Project CRUD Operations
  // Add project 
  createProject(data: any) {
 
    return this.http.post(this.apiUrl + "/admin/project", data, { headers: this.headers });
  }

  // Assign Employee To Project
  // assignEmployeeToProject(projectId: number, employeeId: number, data: any) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  // return this.http.post(`${this.apiUrl}/admin/project/${projectId}/assign/${employeeId}`, data, { headers: this.headers });
  //   return this.http.post(`${this.apiUrl}/admin/project/${projectId}/assign/${employeeId}`, data, {headers});
  // }

  // Get all Projects
  getAllProjectsList() {
   
    return this.http.get(this.apiUrl + "/admin/project", { headers: this.headers });
  }

  // Update Project
  updateProject(data: any) {
 
    return this.http.put(this.apiUrl + "/admin/project", data, { headers: this.headers });
  }

  // Delete Project
  deleteProject(projId: any) {
    
    return this.http.delete(`${this.apiUrl}/admin/project/${projId}`, { headers: this.headers });
  }

  //API for GET History
  getHistory(employeeId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history/${employeeId}`, {headers: this.headers});
  }

  // Assign Project to Manager
// src/app/Core/Services/admin.service.ts
assignProjectToManager(projId: string, managId: string) {
  return this.http.post<any>(`http://localhost:8442/api/assignments/project-to-manager`, null, {
    params: {
      projId,
      managId
    }
  });
}

assignEmployeeToProject(empId: string, projId: string) {
  return this.http.post<any>(`${this.apiUrl}/api/assignments/assign-employee-to-project`, null, {
    params: {
      empId,
      projId  // changed from projectId to projId
    }
  });
}



}
