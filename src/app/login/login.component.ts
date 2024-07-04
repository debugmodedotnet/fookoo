import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  showPassword: boolean = false;


  private userservice = inject(UserService);

  constructor(private fb: FormBuilder, private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    console.log(this.loginForm?.value);
    let user = await this.userservice.login(this.loginForm?.value.email, this.loginForm?.value.password);
    this.router.navigate(['/home'], { queryParams: { username: 'JohnDoe' } });
    console.log('Login Successful', user);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}
