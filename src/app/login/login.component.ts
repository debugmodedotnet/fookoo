import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;

  private userservice = inject(UserService);

  constructor(private fb: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     const { email, password } = this.loginForm.value;

  //     // First, try to sign in
  //     this.afAuth.signInWithEmailAndPassword(email, password)
  //       .then(() => {
  //         // User signed in successfully
  //         console.log('User signed in successfully');
  //         this.router.navigate(['/home']);
  //       })
  //       .catch((error) => {
  //         if (error.code === 'auth/user-not-found') {
  //           // If user doesn't exist, create a new account
  //           this.afAuth.createUserWithEmailAndPassword(email, password)
  //             .then((userCredential) => {
  //               // New user created successfully
  //               const user = userCredential.user;

  //               // Store user data in Firestore
  //               this.firestore.collection('users').doc(user?.uid).set({
  //                 email: email,
  //                 createdAt: new Date()
  //               })
  //               .then(() => {
  //                 console.log('New user created and data stored in Firestore');
  //                 this.router.navigate(['/home']);
  //               })
  //               .catch((error) => {
  //                 console.error('Error storing user data:', error);
  //                 this.errorMessage = 'Error storing user data. Please try again.';
  //               });
  //             })
  //             .catch((error) => {
  //               console.error('Registration error:', error);
  //               this.errorMessage = error.message || 'An unexpected error occurred. Please try again.';
  //             });
  //         } else {
  //           // Handle other sign-in errors
  //           console.error('Login error:', error);
  //           this.errorMessage = error.message || 'An unexpected error occurred. Please try again.';
  //         }
  //       });
  //   }
  // }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // First, try to sign in
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(() => {
          // User signed in successfully
          console.log('User signed in successfully');
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            // If user doesn't exist, create a new account
            this.afAuth.createUserWithEmailAndPassword(email, password)
              .then((userCredential) => {
                // New user created successfully
                const user = userCredential.user;

                // Store user data in Firestore
                this.firestore.collection('users').doc(user?.uid).set({
                  email: email,
                  createdAt: new Date()
                })
                  .then(() => {
                    console.log('New user created and data stored in Firestore');
                    this.router.navigate(['/home']);
                  })
                  .catch((error) => {
                    console.error('Error storing user data:', error);
                    this.errorMessage = 'Error storing user data. Please try again.';
                  });
              })
              .catch((error) => {
                console.error('Registration error:', error);
                this.errorMessage = error.message || 'An unexpected error occurred. Please try again.';
              });
          } else {
            // Handle other sign-in errors
            console.error('Login error:', error);
            this.errorMessage = error.message || 'An unexpected error occurred. Please try again.';
          }
        });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}