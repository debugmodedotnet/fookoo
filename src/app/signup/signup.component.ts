import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { IEvent } from '../event';



@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {


   signupForm: FormGroup;
   private signupservice = inject(UserService);
    constructor(private fb: FormBuilder) {
   
      this.signupForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      });
    }

    onSubmit() {
      console.log(this.signupForm?.value);
      this.signupservice.signUp(this.signupForm?.value.email, this.signupForm?.value.password);
      console.log('signup successful');
    }

}
