import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step6',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep6.component.html',
  styleUrl: './jobstep6.component.scss'
})
export class Jobstep6Component {

  jobForm: FormGroup;
  data = model<any>();

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      MinSalary: ['', Validators.required],
      MaxSalary: ['', Validators.required],
    });
  }

  async next() {
    this.data.set({ nextStep: 7, jobId: this.data(), formData: this.jobForm.value });
  }

}
