import { Component, model, } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step7',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep7.component.html',
  styleUrl: './jobstep7.component.scss',
})
export class Jobstep7Component {

  jobForm: FormGroup;
  data = model<any>();
  backdata = model<any>();

  isCompanyTwitterInvalid = false;
  isCompanyLinkedInInvalid = false;
  isCompanyGithubInvalid = false;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      CompanyLinkedIn: [
        '',
        [
          Validators.pattern('https?://www.linkedin.com/in/.+'),
          Validators.minLength(5)
        ],
      ],
      CompanyGithub: [
        '',
        [
          Validators.pattern('https?://github.com/.+'),
          Validators.minLength(5)
        ],
      ],
      CompanyTwitter: [
        '',
        [
          Validators.pattern('https?://x.com/.+'),
          Validators.minLength(5)
        ],
      ],
      isActive: [false]
    });
  }

  async next() {
    if (this.jobForm.valid) {
      this.isCompanyLinkedInInvalid = false;
      this.isCompanyGithubInvalid = false;
      this.isCompanyTwitterInvalid = false;

      this.jobForm.patchValue({ isActive: true });

      this.data.set({
        nextStep: 8,
        jobId: this.data(),
        formData: this.jobForm.value,
      });
    } else {
      if (!this.jobForm.get('CompanyLinkedIn')?.valid) {
        this.isCompanyLinkedInInvalid = true;
      } else if (!this.jobForm.get('CompanyGithub')?.valid) {
        this.isCompanyGithubInvalid = true;
      } else if (!this.jobForm.get('CompanyTwitter')?.valid) {
        this.isCompanyTwitterInvalid = true;
      }
    }
  }

  cleanLinkedInMessage(): void {
    this.isCompanyLinkedInInvalid = false;
  }

  cleanGithubMessage(): void {
    this.isCompanyGithubInvalid = false;
  }

  cleanTwitterMessage(): void {
    this.isCompanyTwitterInvalid = false;
  }

}