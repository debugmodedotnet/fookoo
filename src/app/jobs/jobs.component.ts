import { Component, inject, OnInit } from '@angular/core';
import { Job } from '../modules/job';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { ActivatedRoute } from '@angular/router';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { JobService } from '../services/job.service';
import { first, Observable } from 'rxjs';

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
  filteredJobs$!: Observable<Job[]>;
  selectedTag: string | null = '';

  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);

  ngOnInit(): void {
    this.selectedTag = localStorage.getItem('selectedTag') || '';
    console.log(">>> here")
    const id = this.route.snapshot.paramMap.get('id')
    this.jobID = id;
    console.log(this.jobID);
    if (id) {
      this.jobService.getJobById(id).pipe(first()).subscribe({
        next: (res) => {
          console.log(">>> fetched job", res)
          if (res) {
            this.selectedJob = res;
          }
        },
        error: (e) => {
          console.log("Error occurred while fetching job: ", e)
        }
      });
    }

  }

  onSelectJob(job: Job) {
    console.log("select job: ", job)
    this.selectedJob = job;
  }

  onTagChange(tag: string) {
    this.selectedTag = tag;
    localStorage.setItem('selectedTag', tag); // Store the selected tag in localStorage
  }

}
