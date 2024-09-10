import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  private logoutSubject = new Subject<void>();

  // Observable that AttendanceComponent will subscribe to
  logoutObservable = this.logoutSubject.asObservable();

  logout() {
    // Emit the logout event
    this.logoutSubject.next();
  }
}