import { Component, effect, inject, model, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IJobSteps } from '../../modules/post-job';

@Component({
  selector: 'app-job-step1',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep1.component.html',
  styleUrl: './jobstep1.component.scss',
})
export class Jobstep1Component implements OnInit {

  jobForm: FormGroup;
  positions: string[] = [];
  qualifications: string[] = [];

  data = model<any>();
  backdata = model<any>();

  isCompanyInValid = false;
  isPositionInValid = false;
  isQualificationInValid = false;

  private firestore = inject(AngularFirestore);

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      companyName: ['', Validators.required],
      position: ['', Validators.required],
      qualification: ['', Validators.required]
    });

    effect(() => {
      this.jobForm.patchValue(this.backdata());
    });
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
        this.positions = doc?.position ?? [];
        this.qualifications = doc?.qualification ?? [];
      });
  }

  next(): void {
    if (this.jobForm.valid) {
      if (this.jobForm.controls['companyName'].value.trim().length > 2) {
        this.isCompanyInValid = false;
        this.isPositionInValid = false;
        this.isQualificationInValid = false;

        this.data.set({
          nextStep: 2,
          jobId: this.data(),
          formData: this.jobForm.value
        });
      } else {
        this.isCompanyInValid = true;
      }
    } else {
      if (!this.jobForm.get('companyName')?.valid) {
        this.isCompanyInValid = true;
      } else if (!this.jobForm.get('position')?.valid) {
        this.isPositionInValid = true;
      } else if (!this.jobForm.get('qualification')?.valid) {
        this.isQualificationInValid = true;
      }
    }
  }

  cleanNameMessage(): void {
    this.isCompanyInValid = false;
  }

  cleanPositionMessage(): void {
    this.isPositionInValid = false;
  }

  cleanQualificationMessage(): void {
    this.isQualificationInValid = false;
  }

}
