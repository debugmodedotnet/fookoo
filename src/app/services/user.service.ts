import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private afAuth = inject(AngularFireAuth);
  private firestore = inject(AngularFirestore);

  // signUp(email: string, password: string): any {
  //   return this.afAuth.createUserWithEmailAndPassword(email, password);
  // }

  login(email: string, password: string): any {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  addUserDetails(userId: string, userDetails: any): Promise<void> {
    console.log('userDetails:', userDetails);
    return this.firestore.doc(`users/${userId}`).set(userDetails);
  }

  async signUp(email: string, password: string, userDetails: { name: string; age: number; city: string }) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential!.user!.uid;
      await this.firestore.doc(`users/${uid}`).set(userDetails);
      console.log('User signed up and additional information added');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  }

  getCurrentUser1(): Observable<any> {
    
    return this.afAuth.authState.pipe(
      map(user => user ? user : null)
    );
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  isAdmin(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => user?.role === 'admin')
    );
  }

  async updateUserProfile(userDetails:any){
     console.log('userDetails:', userDetails);
     let a = await this.afAuth.currentUser;
     const uid = a!.uid;
     console.log('uid:', uid);
     await this.firestore.doc(`users/${uid}`).update(userDetails);
     console.log('User signed up and additional information added');
  }
}
