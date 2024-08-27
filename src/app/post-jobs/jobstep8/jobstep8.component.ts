import { Component, inject, model, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { Job } from '../../modules/job';
import { FormGroup } from '@angular/forms';

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
  jobForm!: FormGroup;


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

  async next() {
    this.data.set({
      nextStep: 9,
      jobId: this.data(),
    });
  }

  openShareModal() {
    if (this.job) {
      console.log('Opening share modal for job:', this.job);
    }
  }

  shareOnLinkedIn(): void {
    const position = this.job?.position || '';
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(position)}`;
    window.open(url, '_blank');
  }

  shareOnWhatsApp(): void {
    const position = this.job?.position || '';
    const url = `https://wa.me/?text=${encodeURIComponent(position + ' - ' + window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnTwitter(): void {
    const position = this.job?.position || '';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(position)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnInstagram(): void {
    alert('Instagram sharing is not supported directly via a URL.');
  }
}
