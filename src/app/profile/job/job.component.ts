import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Job } from '../../modules/job';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {

  jobForm: FormGroup;
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  jobId?: string;

  constructor() {
    this.jobForm = new FormGroup({
      CompanyName: new FormControl('', Validators.required),
      CompanyUrl: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
      JobDescription: new FormControl('', Validators.required),
      Responsibilities: new FormControl('', Validators.required),
      SkillsRequired: new FormControl('', Validators.required),
      Location: new FormControl('', Validators.required),
      Remote: new FormControl(false),
      CompanyTwitter: new FormControl('', [Validators.pattern('https?://x.com/.+'), Validators.minLength(5)]),
      CompanyLinkedIn: new FormControl('', [Validators.pattern('https?://www.linkedin.com/in/.+'), Validators.minLength(5)]),
      CompanyGithub: new FormControl('', [Validators.pattern('https?://github.com/.+'), Validators.minLength(5)]),
      Position: new FormControl('', Validators.required),
      Email: new FormControl('', [Validators.email]),
      PhoneNo: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      Tag: new FormControl(''),
      ImageUrl: new FormControl('', [Validators.required, Validators.pattern('https?://.+')])
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.jobId = params['id'];
      if (this.jobId) {
        this.loadJobDetails(this.jobId);
      }
    });
  }

  loadJobDetails(jobId: string): void {
    this.jobService.getJobById(jobId).subscribe(
      (job: Job | undefined) => {
        if (job) {
          this.jobForm.patchValue(job);
        } else {
          console.error('Job not found');
        }
      },
      error => {
        console.error('Error loading job details:', error);
      }
    );
  }

  onSubmit() {
    if (this.jobForm.valid) {
      if (this.jobId) {
        this.jobService.updateJob(this.jobId, this.jobForm.value)
          .then(() => {
            console.log('Job successfully updated!');
            this.router.navigate(['/jobs']);  // Redirect to job listings after update
          })
          .catch(error => {
            console.error('Error updating job: ', error);
          });
      } else {
        console.log('Job ID is not available for updating.');
      }
    } else {
      console.log('Form is invalid!');
    }
  }
}

