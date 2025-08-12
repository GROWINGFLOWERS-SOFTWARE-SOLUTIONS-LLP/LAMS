import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  apiURL: string = "http://localhost:8001";

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

  // Apply Leave
  applyLeave(data: any){
    return this.http.post(`${this.apiURL}/api/leave/apply`, data, {headers: this.headers});
  }

  // Get leave for employee
  geEmployeeleave(id:any){
    return this.http.get(`${this.apiURL}/api/leave/employee/${id}`, {headers: this.headers});
  }


  // Get All Pending Leaves
  getAllPendingLeaves(){
    return this.http.get(`${this.apiURL}/api/leave/pending`, {headers: this.headers});
  }
  
  // Approve Leave
  approveLeave(employeeData:any){
    return this.http.put(`${this.apiURL}/api/leave/approve`,employeeData, {headers: this.headers});
  }

  // Reject Leave
  rejectLeave(employeeData:any){
    return this.http.put(`${this.apiURL}/api/leave/reject`,employeeData, {headers: this.headers});
  }

 deleteLeave(leaveId: any) {
  console.log("Leave ID", leaveId);
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
