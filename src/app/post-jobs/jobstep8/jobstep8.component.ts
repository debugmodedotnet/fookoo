import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step8',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep8.component.html',
  styleUrl: './jobstep8.component.scss'
})
export class Jobstep8Component {

  jobForm: FormGroup;
  data = model<any>();

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      CompanyTwitter: ['', [Validators.pattern('https?://x.com/.+'), Validators.minLength(5)]],
      CompanyLinkedIn: ['', [Validators.pattern('https?://www.linkedin.com/in/.+'), Validators.minLength(5)]],
      CompanyGithub: ['', [Validators.pattern('https?://github.com/.+'), Validators.minLength(5)]],
    });
  }

  async next() {
    this.data.set({ nextStep: 8, jobId: this.data(), formData: this.jobForm.value });
  }

}
