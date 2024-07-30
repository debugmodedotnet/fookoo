import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-jobform-1',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobform-1.component.html',
  styleUrl: './jobform-1.component.scss'
})
export class Jobform1Component implements OnInit {

  @Input() jobForm!: FormGroup;  

  private userService = inject(UserService);

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.jobForm.patchValue({ email: user.email || '' });
      }
      else{
        this.jobForm.patchValue({
          email: this.jobForm.get('email')?.value,
        });
      }
    });
  }

}