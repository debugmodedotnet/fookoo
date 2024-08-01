import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JobService } from '../services/job.service';
import { Job } from '../modules/job';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-listing',
  standalone: true,
  imports: [AsyncPipe, RouterModule, FormsModule],
  templateUrl: './job-listing.component.html',
  styleUrl: './job-listing.component.scss'
})
export class JobListingComponent implements OnInit {

  jobs$: Observable<Job[]> = of([]);
  filteredJobs: Job[] = [];

  companyFilter = '';
  positionFilter = '';
  remoteFilter = false;


  private jobService = inject(JobService);

  ngOnInit() {
    // this.jobs$ = this.jobService.getJobs();
    this.jobs$ = this.jobService.getJobs();
    this.jobs$.subscribe(jobs => {
      this.filteredJobs = jobs;
    });
  }

  applyFilters() {
    this.jobs$.subscribe(jobs => {
      this.filteredJobs = jobs.filter(job => {
        const companyMatch = job.companyName.toLowerCase().includes(this.companyFilter.toLowerCase());
        const positionMatch = job.position.toLowerCase().includes(this.positionFilter.toLowerCase());
        const remoteMatch = !this.remoteFilter || (this.remoteFilter && job.Remote);
        return companyMatch && positionMatch && remoteMatch;
      });
    });
  }

}
