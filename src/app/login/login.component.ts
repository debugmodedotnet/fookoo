import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;
  returnUrl = '/';

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private afAuth = inject(AngularFireAuth);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.returnUrl =
      this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    try {
      const { email, password } = this.loginForm.value;
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log(res);
      const t = await res.user?.getIdToken();
      console.log(t);
       if (t) {
         localStorage.setItem('token', t);
       }

      
      this.router.navigateByUrl(this.returnUrl);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        this.errorMessage =
          'User not found. Please sign up or try a different email.';
      } else if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage =
          'The email address is invalid. Please enter a valid email.';
      } else if (error.code === 'auth/invalid-credential') {
        this.errorMessage =
          'The credentials provided are incorrect or malformed. Please check and try again.';
      } else {
        this.errorMessage =
          error.message || 'An unexpected error occurred. Please try again.';
      }
    }
  }
}