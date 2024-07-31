import { Component, inject, model, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { Job } from '../../modules/job';

@Component({
  selector: 'app-job-step9',
  standalone: true,
  imports: [],
  templateUrl: './jobstep9.component.html',
  styleUrl: './jobstep9.component.scss'
})
export class Jobstep9Component implements OnInit {

  data = model<any>();
  job: Job | null = null;
  defaultImage = 'assets/images/home/default_company.png';

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
          console.log("Error occurred while fetching job: ", e)
        }
      });
    }
  }

}
