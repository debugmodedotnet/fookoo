import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalValidator } from './sal-validator';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-job-step6',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
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
    }, { validator: SalValidator });

    //this.jobForm.markAllAsTouched();
  }

  async next() {
    if (this.jobForm.valid) {
      this.data.set({ nextStep: 7, jobId: this.data(), formData: this.jobForm.value });
    } else {
      this.jobForm.markAllAsTouched(); 
    }
  }

}
