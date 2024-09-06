import { Component, effect, inject, model, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IJobSteps } from '../../modules/post-job';

@Component({
  selector: 'app-job-step2',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep2.component.html',
  styleUrl: './jobstep2.component.scss',
})
export class Jobstep2Component implements OnInit {

  jobForm: FormGroup;
  data = model<any>();
  backdata = model<any>();

  jobTypes: string[] = [];

  isLocationInValid = false;
  isJobTypeInValid = false;
  isCompanyUrlInValid = false;

  private firestore = inject(AngularFirestore);

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      Location: ['', [Validators.required]],
      jobType: ['', Validators.required],
      CompanyUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });

    effect(() => {
      this.jobForm.patchValue(this.backdata());
    })
  }

  ngOnInit(): void {
    this.getFirestoreData();
  }

  getFirestoreData(): void {
    this.firestore
      .collection('post-job')
      .doc<IJobSteps>('job-steps-data')
      .valueChanges()
      .subscribe((doc: IJobSteps | undefined) => {
        this.jobTypes = doc?.jobType ?? [];
      });
  }

  async next() {
    if (this.jobForm.valid) {
      if (this.jobForm.controls['Location'].value.trim().length > 3) {
        this.isLocationInValid = false;
        this.isJobTypeInValid = false;
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
      } else if (!this.jobForm.get('jobType')?.valid) {
        this.isJobTypeInValid = true;
      } else if (!this.jobForm.get('CompanyUrl')?.valid) {
        this.isCompanyUrlInValid = true;
      }
    }
  }

  cleanLocationMessage(): void {
    this.isLocationInValid = false;
  }

  cleanJobtypeMessage(): void {
    this.isJobTypeInValid = false;
  }

  cleanURLMessage(): void {
    this.isCompanyUrlInValid = false;
  }

}
