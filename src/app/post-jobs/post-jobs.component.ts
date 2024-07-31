import { Component, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Jobstep1Component } from './jobstep1/jobstep1.component';
import { Jobstep2Component } from './jobstep2/jobstep2.component';
import { Jobstep3Component } from './jobstep3/jobstep3.component';
import { Jobstep4Component } from './jobstep4/jobstep4.component';
import { Jobstep5Component } from './jobstep5/jobstep5.component';
import { Jobstep6Component } from './jobstep6/jobstep6.component';
import { Jobstep7Component } from './jobstep7/jobstep7.component';
import { Jobstep8Component } from './jobstep8/jobstep8.component';

@Component({
  selector: 'app-post-jobs',
  standalone: true,
  imports: [Jobstep1Component, Jobstep2Component, Jobstep3Component, Jobstep4Component, Jobstep5Component, Jobstep6Component, Jobstep7Component, Jobstep8Component],
  templateUrl: './post-jobs.component.html',
  styleUrl: './post-jobs.component.scss',
})
export class PostJobsComponent {

  isUserLoggedIn = false;
  currentJobId?: string;
  currentStep = 1;
  dataToSave: any;

  private firestore = inject(AngularFirestore);

  stepChange(data: any) {
    this.currentStep = data.nextStep;
    this.dataToSave = data.formData;

    if (this.currentStep === 2) {
      this.saveInitialData();
    } else {
      this.saveData();
    }

    console.log(this.currentJobId);
  }

  async saveData() {
    const formData = this.dataToSave;
    const docId = this.currentJobId;
    console.log(formData);
    console.log(docId);
    await this.firestore
      .collection('jobForms')
      .doc(docId)
      .set(formData, { merge: true })
      .then(() => {
        console.log('Data added successfully with ID:', docId);
      })
      .catch((error) => {
        console.error('Error adding data: ', error);
      });
  }

  saveInitialData() {
    const formData = this.dataToSave;
    const collectionRef = this.firestore.collection('jobForms');
    const docRef = collectionRef.doc();
    formData.id = docRef.ref.id;
    this.currentJobId = formData.id;
    docRef
      .set(formData)
      .then(() => {
        console.log('Data saved successfully with ID:', formData.id);
      })
      .catch((error) => {
        console.error('Error Posting Job data: ', error);
      });
  }
}
