import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../services/job.service';
import { Job } from '../modules/job';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent implements OnInit {

  job: Job | null = null;
  defaultImage = 'assets/images/home/default_company.png';

  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    console.log(id);

    if (id) {
      this.jobService.getJobById(id).subscribe({
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
