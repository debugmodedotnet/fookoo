import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../services/job.service';
import { Job } from '../modules/job';
import { UserService } from '../services/user.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent implements OnInit {

  job: Job | null = null;
  defaultImage = 'assets/images/home/default_company.png';
  user: any;
  jobDescriptionHtml!: SafeHtml;

  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private userService = inject(UserService);
  public router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    console.log(id);

    if (id) {
      this.jobService.getJobById(id).subscribe({
        next: (data) => {
          if (data) {
            this.job = data;
            this.jobDescriptionHtml = this.sanitizer.bypassSecurityTrustHtml(data.JobDescription || '');
          }
        },
        error: (e) => {
          console.log("Error occurred while fetching job: ", e)
        }
      });
    }

    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  applyJob() {
    if (this.user) {
      //this.router.navigate(['/post-job']);
      console.log("Job has been applied");
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
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
