import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
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

  //     this.afAuth.signInWithEmailAndPassword(email, password)
  //       .then(() => {
  //         // User signed in successfully
  //         console.log('User signed in successfully');
  //         this.router.navigate(['/home']);
  //       })
  //       .catch((error) => {
  //         if (error.code === 'auth/user-not-found') {            
  //           this.errorMessage = 'User not found. Please sign up or try a different email.';
  //         }

  //         else if (error.code === 'auth/wrong-password') {
  //           this.errorMessage = 'Incorrect password. Please try again.';
  //         } 

  //         else if (error.code === 'auth/invalid-email') {
  //           this.errorMessage = 'The email address is invalid. Please enter a valid email.';
  //         } 

  //         else if (error.code === 'auth/invalid-credential') {
  //           this.errorMessage = 'The credentials provided are incorrect or malformed. Please check and try again.';
  //         } 

  //         else {
  //           console.error('Login error:', error);
  //           this.errorMessage = error.message || 'An unexpected error occurred. Please try again.';
  //         }
  //       });
  //   }
  // }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(() => {
          // User signed in successfully
          console.log('User signed in successfully');
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          console.error('Login error code:', error.code);
          console.error('Login error message:', error.message);

          if (error.code === 'auth/user-not-found') {
            this.errorMessage = 'User not found. Please sign up or try a different email.';
          }

          else if (error.code === 'auth/wrong-password') {
            this.errorMessage = 'Incorrect password. Please try again.';
          }

          else if (error.code === 'auth/invalid-email') {
            this.errorMessage = 'The email address is invalid. Please enter a valid email.';
          }

          else if (error.code === 'auth/invalid-credential') {
            this.errorMessage = 'The credentials provided are incorrect or malformed. Please check and try again.';
          }

          else {
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