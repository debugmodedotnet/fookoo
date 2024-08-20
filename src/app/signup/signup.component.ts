import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  signupError: string | null = null;

  private signupservice = inject(UserService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }

  onSubmit() {
    const email = this.signupForm?.value.email;
    const password = this.signupForm?.value.password;
    const userDetails = {
      name: this.signupForm?.value.name,
      age: 30,
      city: ""
    };

    this.signupservice.signUp(email, password, userDetails).then(() => {
      // Handle successful signup, such as navigating to a different page
      //this.router.navigate(['/login']);
      this.signupError = null;
    }).catch(error => {
      // Handle signup error
      if (error.code === 'auth/email-already-in-use') {
        this.signupError = 'This email is already registered. Please sign in instead.';
        
      } else {
        this.signupError = 'An error occurred. Please try again.';
      }
      console.error('Error signing up:', error);
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

}