import { Component, effect, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step2',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep2.component.html',
  styleUrl: './jobstep2.component.scss',
})
export class Jobstep2Component {

  jobForm: FormGroup;
  data = model<any>();
  backdata = model<any>();

  isLocationInValid = false;
  isCompanyUrlInValid = false;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      Location: ['', [Validators.required]],
      Remote: [false],
      CompanyUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });

    effect(() => {
      console.log(this.backdata());
      this.jobForm.patchValue(this.backdata());
    })
  }

  async next() {
    if (this.jobForm.valid) {
      if (this.jobForm.controls['Location'].value.trim().length > 3) {
        this.isLocationInValid = false;
        this.isCompanyUrlInValid = false;

        this.data.set({
          nextStep: 3,
          jobId: this.data(),
          formData: this.jobForm.value,
          persisted: true
        });
      } else {
        this.isLocationInValid = true;
      }
    } else {
      if (!this.jobForm.get('Location')?.valid) {
        this.isLocationInValid = true;
      } else if (!this.jobForm.get('CompanyUrl')?.valid) {
        this.isCompanyUrlInValid = true;
      }
    }
  }

  cleanLocationMessage(): void {
    this.isLocationInValid = false;
  }

  cleanURLMessage(): void {
    this.isCompanyUrlInValid = false;
  }

}
