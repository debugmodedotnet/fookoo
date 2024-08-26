import { Component, effect, inject, model, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IJobStep1 } from '../../modules/post-job';

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
  qualifications: string[] = ['BCA', 'B.Tech', 'Diploma', 'BSc'];
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
      qualification: ['', Validators.required],
    });

    effect(() => {
      console.log(this.backdata());
      this.jobForm.patchValue(this.backdata());
    });
  }

  ngOnInit(): void {
    this.getPositions();
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

  back(): void {
    this.backdata.set({ previousStep: 1, jobId: this.data() });
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

  getPositions(): void {
    this.firestore
      .collection('post-job')
      .doc<IJobStep1>('job-step-1')
      .valueChanges()
      .subscribe((doc: IJobStep1 | undefined) => {
        this.positions = doc?.position ?? [];
      });
  }
}
