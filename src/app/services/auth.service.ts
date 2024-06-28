import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<string>('User');
  user$ = this.userSubject.asObservable();


  constructor() {}

  getUser(): Observable<string> {
    return this.user$;
  }

  setUser(name: string): void {
    this.userSubject.next(name);
  }

 
}



