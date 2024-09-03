import { Component, CUSTOM_ELEMENTS_SCHEMA, model } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-job-step6',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, QuillModule],
  templateUrl: './jobstep6.component.html',
  styleUrl: './jobstep6.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Jobstep6Component {

  data = model<any>();
  jobForm: FormGroup;
  backdata = model<any>();

  quillConfig: any;
  
  isDescriptionInValid = false;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      JobDescription: ['', [Validators.required, Validators.minLength(200)]],
    });
  }

  async next() {
    if (this.jobForm.valid) {
      if (this.jobForm.controls['JobDescription'].value.trim().length > 3) {
        this.isDescriptionInValid = false;
        this.data.set({
          nextStep: 7,
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
