import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step6',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep6.component.html',
  styleUrl: './jobstep6.component.scss',
})
export class Jobstep6Component {
  data = model<any>();
  jobForm: FormGroup;
  isDescriptionInValid = false;
  backdata = model<any>();

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      JobDescription: ['', Validators.required],
    });
  }

  async next() {
    if (this.jobForm.valid) {
      if (this.jobForm.controls['JobDescription'].value.trim().length > 3) {
        this.isDescriptionInValid = false;
        this.data.set({
          nextStep: 8,
          jobId: this.data(),
          formData: this.jobForm.value,
        });
      } else {
        this.isDescriptionInValid = true;
      }
    } else {
      this.isDescriptionInValid = true;
    }
  }

  cleanMessage(): void {
    this.isDescriptionInValid = false;
  }
}
