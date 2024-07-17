import { Component, inject, OnInit } from '@angular/core';
import { Job } from '../modules/job';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { NgIf } from '@angular/common';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [JobListComponent, JobDetailComponent, NgIf, AllJobsComponent],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  selectedJob!: Job | null;
  jobID!: string | null;
  filteredJobs$: Observable<Job[]>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);

  constructor() {
    this.filteredJobs$ = this.jobService.getJobs(); // Adjust according to your logic
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.jobID = params.get('id');
    });
  }

  onSelectJob(job: Job) {
    this.selectedJob = job;
  }  
}


/*import { Component, inject, OnInit } from '@angular/core';
import { Job } from '../modules/job';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { ActivatedRoute } from '@angular/router';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [JobListComponent, JobDetailComponent, NgIf, AllJobsComponent],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent implements OnInit {

  selectedJob!: Job | null;
  jobID!: string | null;

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.jobID = id;
    console.log(this.jobID);
  }

  onSelectJob(job: Job) {
    this.selectedJob = job;
  }
}*/
