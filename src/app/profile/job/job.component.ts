import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { Job } from '../../modules/job';
import { first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, NgFor],
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  jobForm: FormGroup;
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  jobId?: string;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  userId?: string;

  tags: string[] = ['Angular', 'React', 'GenAI', 'JavaScript', 'TypeScript'];
  positions: string[] = ['Software Engineer', 'ML Engineer', 'Software Developer', 'Social Media Management', 'Senior Software Engineer', 'Intern'];

  private afAuth = inject(AngularFireAuth);

  constructor() {
    this.jobForm = new FormGroup({
      CompanyName: new FormControl('', Validators.required),
      CompanyUrl: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
      JobDescription: new FormControl('', Validators.required),
      Responsibilities: new FormArray([]),
      Qualification: new FormArray([]),
      SkillsRequired: new FormControl('', Validators.required),
      Location: new FormControl('', Validators.required),
      Remote: new FormControl(false),
      CompanyTwitter: new FormControl('', [Validators.pattern('https?://x.com/.+'), Validators.minLength(5)]),
      CompanyLinkedIn: new FormControl('', [Validators.pattern('https?://www.linkedin.com/in/.+'), Validators.minLength(5)]),
      CompanyGithub: new FormControl('', [Validators.pattern('https?://github.com/.+'), Validators.minLength(5)]),
      Position: new FormControl('', Validators.required),
      Email: new FormControl('', [Validators.email]),
      PhoneNo: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      Tag: new FormControl('', [Validators.required]),
      ImageUrl: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
      Private: new FormControl(false)
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.jobId = params['id'];
      if (this.jobId) {
        this.loadJobDetails(this.jobId);
      }
    });
    this.afAuth.user.pipe(first()).subscribe(async res => {
      console.log(res)
      this.userId = res?.uid;
    });
  }

  get responsibilities(): FormArray {
    return this.jobForm.get('Responsibilities') as FormArray;
  }

  get qualifications(): FormArray {
    return this.jobForm.get('Qualification') as FormArray;
  }

  loadJobDetails(jobId: string): void {
    this.jobService.getJobById(jobId).subscribe(
      (job: Job | undefined) => {
        if (job) {
          this.jobForm.patchValue(job);
          this.setArrayValues('Responsibilities', job.Responsibilities || []);
          this.setArrayValues('Qualification', job.Qualification || []);
        } else {
          console.error('Job not found');
        }
      },
      error => {
        console.error('Error loading job details:', error);
      }
    );
  }

  private setArrayValues(controlName: string, values: string[]): void {
    const formArray = this.jobForm.get(controlName) as FormArray;
    formArray.clear();
    values.forEach(value => formArray.push(new FormControl(value)));
  }

  addResponsibility(value: string): void {
    if (value) {
      this.responsibilities.push(new FormControl(value));
    }
  }

  removeResponsibility(index: number): void {
    if (this.responsibilities.length > 1) {
      this.responsibilities.removeAt(index);
    }
  }

  addQualification(value: string): void {
    if (value) {
      this.qualifications.push(new FormControl(value));
    }
  }

  removeQualification(index: number): void {
    if (this.qualifications.length > 1) {
      this.qualifications.removeAt(index);
    }
  }

  resetForm(): void {
    this.jobForm.reset({
      CompanyName: '',
      CompanyUrl: '',
      JobDescription: '',
      Responsibilities: [], // Reset responsibilities FormArray
      Qualification: [], // Reset qualifications FormArray
      SkillsRequired: '',
      Location: '',
      Remote: false,
      CompanyGithub: '',
      CompanyTwitter: '',
      CompanyLinkedIn: '',
      Email: '',
      PhoneNo: '',
      Tag: '',
      ImageUrl: ''
    });
    this.responsibilities.clear(); // Manually clear the FormArray
    this.qualifications.clear(); // Manually clear the FormArray
  }

  addJobWithCustomId(jobData: any): void {
    this.jobService.getJobs().pipe(first()).subscribe(
      (snapshot) => {
        this.jobService.addJob(jobData)
          .then(() => {
            this.message = 'Job has been successfully created!';
            this.messageType = 'success';
            this.resetForm(); // Reset the form after successful job creation
            console.log(snapshot);
          })
          .catch(error => {
            this.message = 'An error occurred while creating the job.';
            this.messageType = 'error';
            console.error('Error creating job: ', error);
          });
      },
      error => {
        console.error('Error fetching job count:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      if (this.jobId) {
        this.jobService.updateJob(this.jobId, { ...this.jobForm.value, userId: this.getUserId() })
          .then(() => {
            this.message = 'Job has been successfully updated!';
            this.messageType = 'success';
            this.router.navigate(['/view-job']); // Redirect to view jobs page
          })
          .catch(error => {
            this.message = 'An error occurred while updating the job.';
            this.messageType = 'error';
            console.error('Error updating job: ', error);
          });
      } else {
        this.addJobWithCustomId({ ...this.jobForm.value, userId: this.getUserId() });
      }
    } else {
      this.message = 'Please fill out all required fields correctly.';
      this.messageType = 'error';
    }
  }

  getUserId(): string {
    if (!this.userId) {
      throw new Error("UserId not found");
    }
    return this.userId;
  }
}

