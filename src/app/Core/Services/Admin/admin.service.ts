import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiUrl: string = "http://localhost:8442";
  headers: HttpHeaders | { [header: string]: string | string[]; } | undefined;

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

// Add Menus Api  
// Add Department
 addDepartment(data: any) {
  return this.http.post(this.apiUrl + "admin/department", { headers: this.headers });
}

// Get All Departments
getAllDepartments() {
  return this.http.get(this.apiUrl + "admin/departments", { headers: this.headers });
}

// Update Department
updateDepartment(id: number, data: any) {
  return this.http.put(this.apiUrl + "admin/department", data, { headers: this.headers });
}

// Delete Department
deleteDepartment(id: number) {
  return this.http.delete(this.apiUrl + "admin/department/{id}", { headers: this.headers });
}

// Roles CRUD Operations
// Add Role
addRole(data: any) {
  return this.http.post(this.apiUrl + "admin/role", data, { headers: this.headers });
}

// Get All Roles
getAllRoles() {
  return this.http.get(this.apiUrl + "admin/roles", { headers: this.headers });
}

// Update Role
updateRole(id: number, data: any) {
  return this.http.put(this.apiUrl + "admin/role", data, { headers: this.headers });
}

// Delete Role
deleteRole(id: number) {
  return this.http.delete(this.apiUrl + "admin/role/{id}", { headers: this.headers });
}

// Manager CRUD Operations
// Add Manager
addManager(data: any) {
  return this.http.post(this.apiUrl + "admin/manager", data, { headers: this.headers });
}

// Get All Managers
getAllManagers() {
  return this.http.get(this.apiUrl + "admin/managers", { headers: this.headers });
}

// Update Manager
updateManager(id: number, data: any) {
  return this.http.put(this.apiUrl + "admin/manager", data, { headers: this.headers });
}

// Delete Manager
deleteManager(id: number) {
  return this.http.delete(this.apiUrl + "admin/manager/{id}", { headers: this.headers });
}

// Project CRUD Operations
// Add project 
addProject(data: any) {
  return this.http.post(this.apiUrl + "admin/project", data, { headers: this.headers });
}

// Assign Employee To Project
assignEmployeeToProject(data: any) {
  return this.http.post(this.apiUrl + "admin/project/{projectId}/assign/{employeeId}", data, { headers: this.headers });
}

// Get all Projects
getAllProjects() {
  return this.http.get(this.apiUrl + "admin/project", { headers: this.headers });
}

// Get Employees in Project
getEmployeesInProject() {
  return this.http.get(this.apiUrl + "admin/project/{id}/employees", { headers: this.headers });
}

// Get Project Details
getProjectDetails() {
  return this.http.get(this.apiUrl + "admin/project/{id}", { headers: this.headers });
}

// Update Project
updateProject(id: number, data: any) {
  return this.http.put(this.apiUrl + "admin/project", data, { headers: this.headers });
}

// Delete Project
deleteProject(id: number) {
  return this.http.delete(this.apiUrl + "admin/project/{id}", { headers: this.headers });
}

}
