import { Component, inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-job-step1',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep1.component.html',
  styleUrl: './jobstep1.component.scss',
})
export class Jobstep1Component implements OnInit {
  jobForm: FormGroup;
  data = model<any>();

  private userService = inject(UserService);
  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.jobForm.patchValue({ email: user.email || '' });
      } else {
        this.jobForm.patchValue({
          email: this.jobForm.get('email')?.value,
        });
      }
    });
  }

  next() {
     this.data.set({
       nextStep: 2,
       jobId: undefined,
       formData: this.jobForm.value,
     });

  }
}
