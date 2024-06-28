import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { IEvent } from '../modules/event';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signupForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  private signupservice = inject(UserService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      name : ['', [Validators.required]]
    });
  }

  onSubmit() {

  const email = this.signupForm?.value.email;
  const password = this.signupForm?.value.password;
  const userDetails = {
    name: this.signupForm?.value.name,
    age: 30,
    city: 'New York'
  };

  this.signupservice.signUp(email, password, userDetails).then(() => {
    // Handle successful signup, such as navigating to a different page
    this.router.navigate(['/profile']);

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
