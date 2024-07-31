import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step3',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep3.component.html',
  styleUrl: './jobstep3.component.scss',
})
export class Jobstep3Component {

  jobForm: FormGroup;
  data = model<any>();
  isLocationInValid = false;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      Location: ['', [Validators.required]],
      Remote: [false],
    });
  }

  async next() {
    if (this.jobForm.valid) {
      if (this.jobForm.controls['Location'].value.trim().length > 3) {
        this.isLocationInValid = false;

        this.data.set({
          nextStep: 4,
          jobId: this.data(),
          formData: this.jobForm.value,
        });
      }
      else {
        this.isLocationInValid = true
      }
    }
    else {
      this.isLocationInValid = true;
    }
  }

  cleanMessage(): void {
    this.isLocationInValid = false;
  }

}
