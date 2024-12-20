import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, throwError, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { sendEmailVerification } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private afAuth = inject(AngularFireAuth);
  private firestore = inject(AngularFirestore);

  login(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap(userCredential => {
        const user = userCredential.user;
        if (user) {
          const userDetails = {
            email: user.email,
            uid: user.uid,
            name: '',
          };
          return from(this.addUserDetails(user.uid, userDetails)).pipe(
            map(() => userCredential)
          );
        } else {
          return throwError(() => new Error('Login failed. User not found.'));
        }
      }),
      catchError(error => {
        let errorMessage = 'An error occurred during login.';

        if (error && error.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email. Please create an account.';
        } else if (error && error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password. Please try again.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  addUserDetails(userId: string, userDetails: any): Promise<void> {
    return this.firestore.doc(`users/${userId}`).set(userDetails, { merge: true });
  }

  async signUp(email: string, password: string, userDetails: { name: string; }) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    await sendEmailVerification(userCredential.user!);
    const uid = userCredential.user!.uid;
    await this.firestore.doc(`users/${uid}`).set({
      email,
      uid,
      name: userDetails.name,
    });
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap((user: any) => {
        if (user) {
          return this.firestore.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async setQuizAttemptsCount(userId: string, attemptsCount: number): Promise<void> {
    await this.firestore.doc(`users/${userId}`).update({ quizAttempts: attemptsCount });
  }

  isAdmin(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => user?.isadmin === true)
    );
  }

  async updateUserProfile(userDetails: any) {
    const a = await this.afAuth.currentUser;
    const uid = a!.uid;
    await this.firestore.doc(`users/${uid}`).update(userDetails);
  }

  getUserById(uid: string): Observable<any> {
    return this.firestore.doc(`users/${uid}`).valueChanges();
  }

  async refreshUser(): Promise<void> {
    (await this.afAuth.currentUser)?.reload();
  }

}
