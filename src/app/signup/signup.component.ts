import { Component, inject } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

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
    const password = CryptoJS.SHA256(this.signupForm?.value.password).toString(); // Hash the password
    const userDetails = {
      name: this.signupForm?.value.name,
      age: 30,
      city: "",
      password: password // Store the hashed password
    };

    this.signupservice.signUp(email, password, userDetails).then(() => {
      // Handle successful signup, such as navigating to a different page
      this.router.navigate(['/login']);
    }).catch(error => {
      // Handle signup error
      console.error(error);
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

}
