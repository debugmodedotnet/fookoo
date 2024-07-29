import { Component, inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IJobStep1 } from '../../modules/post-job';

@Component({
  selector: 'app-jobform-2',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobform-2.component.html',
  styleUrl: './jobform-2.component.scss'
})
export class Jobform2Component implements OnInit {

  jobForm: FormGroup;
  positions: string[] = [];

  private firestore = inject(AngularFirestore);

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      companyName: ['', Validators.required],
      position: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPositions();
  }

  getPositions() {
    this.firestore.collection('post-job').doc<IJobStep1>('job-step-1').valueChanges()
      .subscribe((doc: IJobStep1 | undefined) => {
        console.log('Fetched document:', doc); 
        this.positions = doc?.position ?? [];
        console.log('Positions:', this.positions); // Log the positions array
      });
  }

}
