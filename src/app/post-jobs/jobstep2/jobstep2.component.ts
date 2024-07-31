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
    this.data.set({ nextStep: 3, jobId: this.data(), formData: this.jobForm.value });
  }

  // async saveData() {
  //   const formData = this.jobForm.value;
  //   const docId = this.data();
  //   await this.firestore
  //     .collection('jobForms')
  //     .doc(docId)
  //     .set(formData, { merge: true })
  //     .then(() => {
  //       console.log('Data added successfully with ID:', docId);
  //     })
  //     .catch((error) => {
  //       console.error('Error adding data: ', error);
  //     });
  // }
}
