import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JobService } from '../services/job.service';
import { Job } from '../modules/job';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-listing',
  standalone: true,
  imports: [AsyncPipe, RouterModule],
  templateUrl: './job-listing.component.html',
  styleUrl: './job-listing.component.scss'
})
export class JobListingComponent implements OnInit {

  jobs$: Observable<Job[]> = of([]);

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.jobs$ = this.jobService.getJobs();
  }

}
