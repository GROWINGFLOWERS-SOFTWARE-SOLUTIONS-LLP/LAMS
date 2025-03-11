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
 
  deleteHoliday(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete(`${this.apiUrl}/admin/holiday/${id}`, { headers });
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
createDepartment(data: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.post(this.apiUrl + "/admin/department",data ,{ headers });
}

// Get All Departments
getAllDepartmentsList() {
    const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.get(this.apiUrl + "/admin/departments", { headers });
}

// Update Department
updateDepartment(data: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.put(this.apiUrl + "/admin/department", data, { headers });
}

// Delete Department
deleteDepartment(depId: string) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.delete(`${this.apiUrl}/admin/department/${depId}`, { headers });

}

// Roles CRUD Operations
createRole(data: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.post(this.apiUrl + "/admin/role",data ,{ headers });
}

// Get All Roles
getAllRolesList() {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.get(this.apiUrl + "/admin/roles", { headers });
}

// Update Role
updateRole(data: any) {
  const headers = new HttpHeaders({
  'Content-Type ': 'application/json',
  });
  return this.http.put(this.apiUrl + "/admin/role", data, { headers });
}

// Delete Role
deleteRole(rolId: string) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.delete(`${this.apiUrl}/admin/role/${rolId}`, { headers });
}

// Manager CRUD Operations
// Add Manager
createManager(data: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.post(`${this.apiUrl}/admin/manager`, data, {headers});
}

// Get All Managers
getAllManagersList() {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.get(this.apiUrl + "/admin/managers", { headers });
}

// Update Manager
updateManager(data: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.put(this.apiUrl + "/admin/manager", data, { headers });
}

// Delete Manager
deleteManager(managId: string) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.delete(`${this.apiUrl}/admin/manager/${managId}`, { headers });

}

// Project CRUD Operations
// Add project 
createProject(data: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.post(this.apiUrl + "/admin/project",data ,{ headers });
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
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.get(this.apiUrl + "/admin/project", { headers });
  }

// Get Employees in Project
// getEmployeesInProject(id: number) {
//   const headers = new HttpHeaders({
//     'Content-Type': 'application/json',
//   });
  // return this.http.get(`${this.apiUrl}/admin/project/${id}/employees`, { headers: this.headers });
  // return this.http.get(this.apiUrl + "/admin/project/${id}/employees", { headers });
//   return this.http.get(`${this.apiUrl}/admin/project/${id}/employees`, { headers });
// }

// Get Project Details
getProjectDetails(id: number) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  // return this.http.get(`${this.apiUrl}/admin/project/${id}`, { headers });
  return this.http.get(this.apiUrl + "/admin/project/${id}", { headers });
  

}

// Update Project
updateProject(data: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.put(this.apiUrl + "/admin/project", data, { headers });
}

// Delete Project
deleteProject(projId: string) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
 return this.http.delete(`${this.apiUrl}/admin/project/${projId}`, { headers });
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
