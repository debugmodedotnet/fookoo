import { Component, effect, Input, model, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step2',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep2.component.html',
  styleUrl: './jobstep2.component.scss',
})
export class Jobstep2Component implements OnChanges {
  jobForm: FormGroup;
  data = model<any>();
  backdata = model<any>();
  @Input() savedJob: any;
  isLocationInValid = false;
  isCompanyUrlInValid = false;
  isImageUrlInValid = false;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      Location: ['', [Validators.required]],
      Remote: [false],
      CompanyUrl: [
        '',
        [Validators.required, Validators.pattern('https?://.+')],
      ],
      ImageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });

    effect(()=>{
      console.log(this.backdata());
      this.jobForm.patchValue(this.backdata());
    })
  }

  ngOnChanges(): void {
    // console.log(this.savedJob);
    // this.jobForm.patchValue(this.backdata());
  }

  async next() {
    if (this.jobForm.valid) {
      if (this.jobForm.controls['Location'].value.trim().length > 3) {
        this.isLocationInValid = false;

        this.data.set({
          nextStep: 3,
          jobId: this.data(),
          formData: this.jobForm.value,
          persisted:true
        });
      } else {
        this.isLocationInValid = true;
      }
    } else {
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

  back(): void {
    this.backdata.set({ previousStep: 1, jobId: this.data() });
  }
}
