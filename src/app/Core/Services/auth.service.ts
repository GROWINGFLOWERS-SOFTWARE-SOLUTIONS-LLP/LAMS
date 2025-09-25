import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  private logoutSubject = new Subject<void>();

  // Observable that AttendanceComponent will subscribe to
  logoutObservable = this.logoutSubject.asObservable();

  getLoggedInUser(): any {
    const user = localStorage.getItem("userValue");
    return user ? JSON.parse(user) : null;
  }

  getUserFullName(): string {
    const user = this.getLoggedInUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  logout() {
    // Emit the logout event
    this.logoutSubject.next();
  }
}