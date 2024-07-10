import { Component } from '@angular/core';
import { Job } from '../modules/job';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [JobListComponent, JobDetailComponent],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {
  selectedJob: Job | null = null;

  onSelectJob(job: Job) {
    this.selectedJob = job;
  }
}
