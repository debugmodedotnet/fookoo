import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JobService } from '../services/job.service';
import { Job } from '../modules/job';
import { AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { IUser } from '../modules/user';

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
  user?: IUser;

  companyFilter = '';
  positionFilter = '';
  remoteFilter = false;

  private jobService = inject(JobService);
  private userService = inject(UserService);
  public router = inject(Router);

  ngOnInit() {
    this.jobs$ = this.jobService.getJobs();
    this.jobs$.subscribe(jobs => {
      this.filteredJobs = jobs;
    });

    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  applyFilters() {
    this.jobs$.subscribe(jobs => {
      this.filteredJobs = jobs.filter(job => {
        const companyMatch = job.companyName?.toLowerCase().includes(this.companyFilter.toLowerCase()) ?? false;
        const positionMatch = job.position?.toLowerCase().includes(this.positionFilter.toLowerCase()) ?? false;
        const remoteMatch = !this.remoteFilter || (this.remoteFilter && job.Remote);
        return companyMatch && positionMatch && remoteMatch;
      });
    });
  }

  closeModal() {
    const modalElement = document.getElementById('jobModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.removeAttribute('aria-modal');
      modalElement.removeAttribute('role');

      const closeButton = modalElement.querySelector('.btn-close');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }
      
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode?.removeChild(backdrop);
      }

      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  redirectToLogin() {
    this.closeModal();
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  postJob() {
    if (this.user) {
      this.router.navigate(['/post-job']);
    }
  }

}
