import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalValidator } from './sal-validator';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-job-step5',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './jobstep5.component.html',
  styleUrl: './jobstep5.component.scss',
})
export class Jobstep5Component {
  jobForm: FormGroup;
  data = model<any>();
  backdata = model<any>();

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group(
      {
        MinSalary: ['', Validators.required],
        MaxSalary: ['', Validators.required],
      },
      { validator: SalValidator }
    );

    //this.jobForm.markAllAsTouched();
  }

  async next() {
    if (this.jobForm.valid) {
      this.data.set({
        nextStep: 7,
        jobId: this.data(),
        formData: this.jobForm.value,
      });
    } else {
      this.jobForm.markAllAsTouched();
    }
  }
}
