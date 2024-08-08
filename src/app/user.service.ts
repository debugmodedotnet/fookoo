import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private afAuth = inject(AngularFireAuth);

  signUp(email: string, password: string): any {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string): any {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }
  

}
