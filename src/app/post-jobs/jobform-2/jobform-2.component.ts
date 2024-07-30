import { Component, inject, Input, OnInit } from '@angular/core';
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

  @Input() jobForm!: FormGroup; 
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

    this.jobForm.patchValue({
      companyName: this.jobForm.get('companyName')?.value,
      position: this.jobForm.get('position')?.value
    });
  }

  getPositions() {
    this.firestore.collection('post-job').doc<IJobStep1>('job-step-1').valueChanges()
      .subscribe((doc: IJobStep1 | undefined) => {
        this.positions = doc?.position ?? [];
      });
  }

}
