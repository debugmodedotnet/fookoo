import { Component, inject, Input, model, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IJobStep1 } from '../../modules/post-job';

@Component({
  selector: 'app-job-step2',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep2.component.html',
  styleUrl: './jobstep2.component.scss',
})
export class Jobstep2Component implements OnInit {
  jobForm: FormGroup;
  positions: string[] = [];
  data = model<any>();
  isCompanyInValid = false;
  isPositionInValid = false;
  private firestore = inject(AngularFirestore);
  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      companyName: ['', Validators.required],
      position: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPositions();
    // this.jobForm.patchValue({
    //   companyName: this.jobForm.get('companyName')?.value,
    //   position: this.jobForm.get('position')?.value,
    // });
    console.log(this.data());
  }

  getPositions() {
    this.firestore
      .collection('post-job')
      .doc<IJobStep1>('job-step-1')
      .valueChanges()
      .subscribe((doc: IJobStep1 | undefined) => {
        this.positions = doc?.position ?? [];
      });
  }

  async next() {
    if (this.jobForm.valid) {
      this.isPositionInValid = false;
      this.isCompanyInValid = false;
      this.data.set({
        nextStep: 3,
        jobId: this.data(),
        formData: this.jobForm.value,
      });
    } else {
      if (!this.jobForm.get('companyName')?.valid) {
        this.isCompanyInValid = true;
      } else if (!this.jobForm.get('position')?.valid) {
        this.isPositionInValid = true;
      }
    }
  }

  cleanPositionMessage(): void {
      this.isPositionInValid = false;
  }

  cleanNameMessage(): void {
    this.isCompanyInValid = false;
  }
}
