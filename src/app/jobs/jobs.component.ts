import { Component, inject, OnInit } from '@angular/core';
import { Job } from '../modules/job';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { ActivatedRoute } from '@angular/router';
import { AllJobsComponent } from './all-jobs/all-jobs.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [JobListComponent, JobDetailComponent, AllJobsComponent],
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
}
