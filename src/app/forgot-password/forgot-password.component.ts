import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string | null = null;
  isSuccess = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;

      // Send password reset email
      this.afAuth.sendPasswordResetEmail(email)
        .then(() => {
          this.isSuccess = true;
          this.message = 'Password reset email sent. Please check your inbox.';
          setTimeout(() => this.router.navigate(['/login']), 5000);
        })
        .catch((error) => {
          this.isSuccess = false;
          if (error.code === 'auth/user-not-found') {
            this.message = 'No user found with this email address.';
          } else {
            this.message = 'An error occurred. Please try again later.';
          }
        });
    }
  }
}