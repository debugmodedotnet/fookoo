import { Component, inject, model, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { Job } from '../../modules/job';

@Component({
  selector: 'app-job-step8',
  standalone: true,
  imports: [],
  templateUrl: './jobstep8.component.html',
  styleUrl: './jobstep8.component.scss',
})
export class Jobstep8Component implements OnInit {
  data = model<any>();
  job: Job | null = null;
  defaultImage = 'assets/images/home/default_company.png';
  backdata = model<any>();

  private jobService = inject(JobService);

  ngOnInit(): void {
    const jobId = this.data();
    console.log(jobId);

    if (jobId) {
      this.jobService.getJobById(jobId).subscribe({
        next: (data) => {
          if (data) {
            this.job = data;
          }
        },
        error: (e) => {
          console.log('Error occurred while fetching job: ', e);
        },
      });
    }
  }
}
