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
  isCompanyUrlInValid = false;
  isImageUrlInValid = false;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      Location: ['', [Validators.required]],
      Remote: [false],
      CompanyUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      ImageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
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
      this.isCompanyUrlInValid = true;
      this.isImageUrlInValid = true;
    }
  }

  cleanLocationMessage(): void {
    this.isLocationInValid = false;
  }

  cleanURLMessage(): void {
    this.isCompanyUrlInValid = false;
  }

  cleanImageMessage(): void {
    this.isImageUrlInValid = false;
  }

}
