import { Injectable , inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth)

  register(email: string , username: string, password: string): Observable<void>{
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ). then((response) => 
      updateProfile(response.user, {displayName : username}),
    );
    return from(promise);
  }
}



