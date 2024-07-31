import { Component, inject, Input, model, } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step8',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep8.component.html',
  styleUrl: './jobstep8.component.scss'
})
export class Jobstep8Component {

  jobForm: FormGroup;
  data = model<any>();
  isCompanyTwitterInvalid = false;
  isCompanyLinkedInInvalid = false;
  isCompanyGithubInvalid = false;
  

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      CompanyLinkedIn: ['', [Validators.pattern('https?://www.linkedin.com/in/.+'), Validators.minLength(5),Validators.required]],
      CompanyGithub: ['', [Validators.pattern('https?://github.com/.+'), Validators.minLength(5),Validators.required]],
      CompanyTwitter: ['', [Validators.pattern('https?://x.com/.+'), Validators.minLength(5), Validators.required]],
    });
  }

  async next() {
    if(this.jobForm.valid){
      this.isCompanyLinkedInInvalid = false;
      this.isCompanyGithubInvalid = false;
      this.isCompanyTwitterInvalid = false;
     
      this.data.set({ 
        nextStep: 8, 
        jobId: this.data(), 
        formData: this.jobForm.value
      }); 
    }
    else {
      if (!this.jobForm.get('companyLinkedIn')?.valid){
        this.isCompanyLinkedInInvalid = true;
      }
      else if (!this.jobForm.get('companyGithub')?.valid) {
        this.isCompanyGithubInvalid = true;
      } 
      else if (!this.jobForm.get('companyTwitter')?.valid) {
        this.isCompanyTwitterInvalid = true;
      }
      
  }
  
  }

  cleanLinkedInMessage(): void {
    console.log('cleanMessage');
    this.isCompanyLinkedInInvalid = false;
    console.log(this.isCompanyLinkedInInvalid);
  }
  
  cleanGithubMessage(): void {
    console.log('cleanMessage');
    this.isCompanyGithubInvalid = false;
    console.log(this.isCompanyGithubInvalid);
  }

  cleanTwitterMessage(): void {
    console.log('cleanMessage');
    this.isCompanyTwitterInvalid = false;
    console.log(this.isCompanyTwitterInvalid);
  }
  
  
}

