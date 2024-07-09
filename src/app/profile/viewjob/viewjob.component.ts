import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../modules/job';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-view-job',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './viewjob.component.html',
  styleUrls: ['./viewjob.component.scss']
})
export class ViewJobComponent implements OnInit {
  jobs: Job[] = [];
  loading = true;
  jobForm: FormGroup;
  editMode = false;
  currentJobId: string | null = null;
  private jobService = inject(JobService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.jobForm = this.fb.group({
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
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe(
      jobs => {
        this.jobs = jobs;
        console.log('Jobs loaded:', this.jobs);
        this.loading = false;
      },
      error => {
        console.error('Error loading jobs:', error);
        this.loading = false;
      }
    );
  }

  editJob(job: Job): void {
    if (job && job.id) {
      this.jobForm.patchValue(job);
      this.currentJobId = job.id;
      this.editMode = true;
    } else {
      console.error('Job is undefined or job ID is missing.');
    }
  }  

  updateJob(): void {
    if (this.jobForm.valid && this.currentJobId) {
      const updatedJob = this.jobForm.value;

      this.jobService.updateJob(this.currentJobId, updatedJob).then(() => {
        this.editMode = false;
        this.currentJobId = null;
        this.loadJobs();
      }).catch((err: any) => {
        console.error('Update failed', err);
      });
    } else {
      this.jobForm.markAllAsTouched(); // Show validation errors
    }
  }

  deleteJob(jobId?: string): void {
    if (jobId) {
      this.jobService.deleteJob(jobId)
        .then(() => {
          this.loadJobs();
        })
        .catch(error => {
          console.error('Error deleting job:', error);
        });
    } else {
      console.error('Job ID is undefined.');
    }
  }

  resetForm(): void {
    this.jobForm.reset({
      CompanyName: '',
      CompanyUrl: '',
      JobDescription: '',
      Responsibilities: '',
      SkillsRequired: '',
      Position: '',
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
    this.editMode = false;
    this.currentJobId = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }
}


/*import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../modules/job';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-view-job',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './viewjob.component.html',
  styleUrls: ['./viewjob.component.scss']
})
export class ViewJobComponent implements OnInit {
  jobs: Job[] = [];
  loading = true;
  private jobService = inject(JobService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe(
      jobs => {
        this.jobs = jobs;
        console.log('Jobs loaded:', this.jobs); // Debugging line
        this.loading = false;
      },
      error => {
        console.error('Error loading jobs:', error);
        this.loading = false;
      }
    );
  }

  editJob(jobId?: string): void {
    if (jobId) {
      console.log('Navigating to edit job with ID:', jobId); // Debugging line
      this.router.navigate(['/job'], { queryParams: { id: jobId } });
    } else {
      console.error('Job ID is undefined.');
    }
  }

  deleteJob(jobId?: string): void {
    if (jobId) {
      console.log('Deleting job with ID:', jobId); // Debugging line
      this.jobService.deleteJob(jobId)
        .then(() => {
          console.log('Job successfully deleted!');
          this.loadJobs(); // Reload the job list after deletion
        })
        .catch(error => {
          console.error('Error deleting job:', error);
        });
    } else {
      console.error('Job ID is undefined.');
    }
  }
}
*/




