import { Component, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { UserService } from '../services/user.service';
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
  imports: [
    Jobstep1Component,
    Jobstep2Component,
    Jobstep3Component,
    Jobstep4Component,
    Jobstep5Component,
    Jobstep6Component,
    Jobstep7Component,
    Jobstep8Component
  ],
  templateUrl: './post-jobs.component.html',
  styleUrl: './post-jobs.component.scss',
})
export class PostJobsComponent {
  isUserLoggedIn = false;
  currentJobId?: string;
  currentStep = 1;
  dataToSave: any;
  selectedJob: any;
  persisted = false;

  private firestore = inject(AngularFirestore);
  private userService = inject(UserService);

  stepChange(data: any) {
    this.currentStep = data.nextStep;
    this.dataToSave = data.formData ;
    this.persisted = data.persisted || false; 
    
    if (this.currentStep === 2 && this.persisted === false) {
      this.saveInitialData();
    } else {
      this.saveData();
    }

    this.fetchJobDocument();
  }

  async saveData() {
    const formData = this.dataToSave;
    const docId = this.currentJobId;
    await this.firestore
      .collection('jobForms')
      .doc(docId)
      .set(formData, { merge: true });
  }

   saveInitialData() {
   this.userService.getCurrentUser().subscribe((user:any)=>{
     const formData = this.dataToSave;
     const collectionRef = this.firestore.collection('jobForms');
     const docRef = collectionRef.doc();
     formData.id = docRef.ref.id;
     formData.email = user.email;
     this.currentJobId = formData.id;
     docRef
       .set(formData);
   })
    
  }

  backChange(data: any) {
    this.currentStep = data.previousStep;
    this.fetchJobDocument();
  }

  fetchJobDocument(): void {
    this.firestore
      .collection('jobForms')
      .doc(this.currentJobId)
      .get()
      .subscribe(
        (doc) => {
          if (doc.exists) {
            this.selectedJob = doc.data();
          }
        }
      );
  }
}
