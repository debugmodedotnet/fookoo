import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  private userservice = inject(UserService);
   constructor(private fb: FormBuilder) {
  
     this.loginForm = this.fb.group({
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required, Validators.minLength(6)]]
     });
   }

   async onSubmit() {
     console.log(this.loginForm?.value);
     let user = await this.userservice.login(this.loginForm?.value.email, this.loginForm?.value.password);
     console.log('login successful', user);
   }
}
