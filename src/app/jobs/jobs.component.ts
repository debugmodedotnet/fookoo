import { Component } from '@angular/core';
import { Job } from '../modules/job';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {
  selectedJob: Job | null = null; // Initialize to null

  onSelectJob(job: Job) {
    this.selectedJob = job;
  }
}
