import { Component, OnInit, inject } from '@angular/core';
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





