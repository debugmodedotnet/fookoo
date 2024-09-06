import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JobService } from '../services/job.service';
import { Job } from '../modules/job';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { IUser } from '../modules/user';

@Component({
  selector: 'app-job-listing',
  standalone: true,
  imports: [AsyncPipe, RouterModule, FormsModule, SlicePipe],
  templateUrl: './job-listing.component.html',
  styleUrl: './job-listing.component.scss'
})
export class JobListingComponent implements OnInit {

  jobs$: Observable<Job[]> = of([]);
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  user?: IUser;

  jobFilter = '';
  remoteFilter = false;
  sortByPostedTime = false;
  sortBySalary = false;

  displayedJobsCount = 10;
  showLoadMoreButton = false;

  private jobService = inject(JobService);
  private userService = inject(UserService);
  public router = inject(Router);

  ngOnInit() {
    this.jobs$ = this.jobService.getJobs();
    this.jobs$.subscribe(jobs => {
      this.jobs = jobs;
      this.filteredJobs = jobs;
      this.updateLoadMoreButton();
    });

    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  applyFilters() {
    const filterValue = this.jobFilter?.toLowerCase() || '';

    this.filteredJobs = this.jobs.filter(job => {
      const companyMatch = job.companyName?.toLowerCase().includes(filterValue) ?? false;
      const positionMatch = job.position?.toLowerCase().includes(filterValue) ?? false;
      const salaryString = `${job.MinSalary}-${job.MaxSalary}`;
      const salaryMatch = salaryString.includes(filterValue);
      const tagMatch = job.Tag?.toLowerCase().includes(filterValue) ?? false;
      const remoteMatch = !this.remoteFilter || job.Remote;

      return (companyMatch || positionMatch || salaryMatch || tagMatch) && remoteMatch;
    });

    this.displayedJobsCount = 10;
    this.updateLoadMoreButton();
    this.applySorting();
  }

  applySorting() {
    // if (this.sortByPostedTime) {
    //   this.filteredJobs.sort((a, b) => {
    //     const dateA = new Date(a.postedTime).getTime();
    //     const dateB = new Date(b.postedTime).getTime();
    //     return dateB - dateA; 
    //   });
    // }

    if (this.sortBySalary) {
      this.filteredJobs.sort((a, b) => {
        const salaryA = a.MaxSalary ?? a.MinSalary;
        const salaryB = b.MaxSalary ?? b.MinSalary;
        return salaryB - salaryA;
      });
    }
  }

  toggleSortByPostedTime() {
    this.sortByPostedTime = !this.sortByPostedTime;
    this.applyFilters(); // Reapply filters to trigger sorting
  }

  toggleSortBySalary() {
    this.sortBySalary = !this.sortBySalary;
    this.applyFilters();
  }

  updateLoadMoreButton() {
    this.showLoadMoreButton = this.filteredJobs.length > this.displayedJobsCount;
  }

  loadMore() {
    this.displayedJobsCount += 10;
    this.updateLoadMoreButton();
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
    //    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/post-job' } });
  }

  postJob() {
    if (this.user) {
      this.router.navigate(['/post-job']);
    }
  }

}
