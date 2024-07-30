import { UserService } from './../services/user.service';
import { Component, inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-post-jobs',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './post-jobs.component.html',
  styleUrl: './post-jobs.component.scss'
})
export class PostJobsComponent implements OnInit {

  currentStep = 1;
  lastStep = 8;
  jobForm: FormGroup;
  isUserLoggedIn = false;

  private userService = inject(UserService);
  private jobService = inject(JobService);


  @ViewChild('postJobForm', { static: true, read: ViewContainerRef }) postJobForm?: ViewContainerRef;

  private componentMap: Record<number, () => Promise<{ [key: string]: any }>> = {
    1: () => import('./jobform-1/jobform-1.component'),
    2: () => import('./jobform-2/jobform-2.component'),
    3: () => import('./jobform-3/jobform-3.component'),
    4: () => import('./jobform-4/jobform-4.component'),
    5: () => import('./jobform-5/jobform-5.component'),
    6: () => import('./jobform-6/jobform-6.component'),
    7: () => import('./jobform-7/jobform-7.component'),
    8: () => import('./jobform-8/jobform-8.component'),
  };

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.isUserLoggedIn = !!user;
      if (this.isUserLoggedIn) {
        this.currentStep = 2;
      }
      this.loadJobForm();
    });
  }

  async loadJobForm() {
    if (this.postJobForm) {
      this.postJobForm.clear();
      const componentLoader = this.componentMap[this.currentStep];
      if (componentLoader) {
        const module = await componentLoader();
        const component = module[`Jobform${this.currentStep}Component`];
        if (component) {
          this.postJobForm.createComponent(component);
        }
      }
    }
  }

  onNextStep() {
    if (this.currentStep < this.lastStep) {
      this.currentStep++;
      this.loadJobForm();
    }
  }

  onPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.loadJobForm();
    }
  }

  onSubmit() {
    if (this.jobForm.valid) {
      const jobData = this.jobForm.value;
      this.jobService.addJob(jobData)
        .then(() => {
          console.log('Job added successfully');
        })
        .catch(error => {
          console.error('Error adding job:', error);
        });
    } else {
      console.log('Form is invalid');
    }
  }

}
