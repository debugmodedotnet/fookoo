import { Component, inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalValidator } from './sal-validator';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IJobSteps } from '../../modules/post-job';

@Component({
  selector: 'app-job-step5',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep5.component.html',
  styleUrl: './jobstep5.component.scss',
})
export class Jobstep5Component implements OnInit {

  jobForm: FormGroup;
  data = model<any>();
  backdata = model<any>();

  noticePeriods: string[] = [];
  isNoticePeriodInValid = false;

  private firestore = inject(AngularFirestore);

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group(
      {
        MinSalary: ['', Validators.required],
        MaxSalary: ['', Validators.required],
        noticePeriod: ['', Validators.required],
      },
      { validator: SalValidator }
    );

    //this.jobForm.markAllAsTouched();
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
        this.noticePeriods = doc?.noticePeriod ?? [];
      });
  }

  async next() {
    if (this.jobForm.valid) {
      this.isNoticePeriodInValid = false;

      this.data.set({
        nextStep: 6,
        jobId: this.data(),
        formData: this.jobForm.value,
      });
    } else {
      if (!this.jobForm.get('noticePeriod')?.valid) {
        this.isNoticePeriodInValid = true;
      }
      this.jobForm.markAllAsTouched();
    }
  }

  cleanMessage(): void {
    this.isNoticePeriodInValid = false;
  }

}
