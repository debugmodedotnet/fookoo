import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step7',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep7.component.html',
  styleUrl: './jobstep7.component.scss'
})
export class Jobstep7Component {

  data = model<any>();
  jobForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      JobDescription: ['', Validators.required],
    });
  }

  async next() {
    this.data.set({ nextStep: 8, jobId: this.data(), formData: this.jobForm.value });
  }

}
