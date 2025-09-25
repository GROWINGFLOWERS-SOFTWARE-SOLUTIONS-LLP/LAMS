import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  apiURL: string = "http://localhost:8442";

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient){

  }

 // Apply Leave
  applyLeave(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/api/leave/apply`, data, { headers: this.headers });
  }

  // Get leaves for employee by employeeId
  getEmployeeLeaves(employeeId: any): Observable<any> {
    return this.http.get(`${this.apiURL}/api/leave/employee/${employeeId}`, { headers: this.headers });
  }

  // Get all leaves under a manager (by managerName)
  getManagerLeaves(managerName: string): Observable<any> {
    return this.http.get(`${this.apiURL}/api/leave/manager/${managerName}`, { headers: this.headers });
  }

  // Get all pending leaves
  getAllPendingLeaves(): Observable<any> {
    return this.http.get(`${this.apiURL}/api/leave/pending`, { headers: this.headers });
  }

  // // Approve leave (leaveId + optional manager comment)
  // approveLeave(leaveId: string, managerComment?: string): Observable<any> {
  //   return this.http.put(
  //     `${this.apiURL}/api/leave/approve/${leaveId}?managerComment=${managerComment || ''}`,
  //     {},
  //     { headers: this.headers }
  //   );
  // }

  // // Reject leave (leaveId + optional manager comment)
  // rejectLeave(leaveId: string, managerComment?: string): Observable<any> {
  //   return this.http.put(
  //     `${this.apiURL}/api/leave/reject/${leaveId}?managerComment=${managerComment || ''}`,
  //     {},
  //     { headers: this.headers }
  //   );
  // }

  // manager.service.ts
approveLeave(leaveId: string, managerComment: string) {
  return this.http.put(
    `${this.apiURL}/api/leave/approve/${leaveId}?managerComment=${encodeURIComponent(managerComment)}`,
    {}, // empty body because backend doesn’t need it
    { headers: this.headers }
  );
}

rejectLeave(leaveId: string, managerComment: string) {
  return this.http.put(
    `${this.apiURL}/api/leave/reject/${leaveId}?managerComment=${encodeURIComponent(managerComment)}`,
    {}, 
    { headers: this.headers }
  );
}

  // Cancel leave (delete by leaveId)
  deleteLeave(leaveId: any): Observable<any> {
    return this.http.delete(`${this.apiURL}/api/leave/cancel/${leaveId}`, {
      headers: this.headers,
      responseType: 'text' as 'json'
    });
  }


// Notification API Call

// Create a new notification
createNotification(data: any) {
  return this.http.post(`${this.apiURL}/api/notifications`, data, { headers: this.headers });
}

// Get all notifications
getAllNotifications() {
  return this.http.get(`${this.apiURL}/api/notifications`, { headers: this.headers });
}

// Get a specific notification by ID
getNotificationById(notificationId: string) {
  return this.http.get(`${this.apiURL}/api/notifications/${notificationId}`, { headers: this.headers });
}

// Update a notification by ID
updateNotification(notificationId: string, data: any) {
  return this.http.put(`${this.apiURL}/api/notifications/${notificationId}`, data, { headers: this.headers });
}

// Delete a notification by ID
deleteNotification(notificationId: string) {
  return this.http.delete(`${this.apiURL}/api/notifications/${notificationId}`, {
    headers: this.headers,
    responseType: 'text' as 'json'
  });
}

}
