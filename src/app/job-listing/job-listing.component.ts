import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JobService } from '../services/job.service';
import { Job } from '../modules/job';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { IUser } from '../modules/user';
import { IJobSteps } from '../modules/post-job';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TimeAgoPipePipe } from '../pipes/time-ago-pipe.pipe';

@Component({
  selector: 'app-job-listing',
  standalone: true,
  imports: [AsyncPipe, RouterModule, FormsModule, SlicePipe, TimeAgoPipePipe],
  templateUrl: './job-listing.component.html',
  styleUrl: './job-listing.component.scss'
})
export class JobListingComponent implements OnInit {

  jobs$: Observable<Job[]> = of([]);
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  jobTypes: string[] = [];
  user?: IUser;

  jobFilter = '';
  jobTypeFilter = ''
  sortByPostedTime = false;
  //sortBySalary = false;
  salarySortOption: 'none' | 'asc' | 'desc' = 'none';

  displayedJobsCount = 10;
  showLoadMoreButton = false;

  private jobService = inject(JobService);
  private userService = inject(UserService);
  public router = inject(Router);
  private firestore = inject(AngularFirestore);

  ngOnInit() {
    this.jobs$ = this.jobService.getJobs();
    this.jobs$.subscribe(jobs => {
      this.jobs = jobs;
      this.filteredJobs = jobs;
      this.applyFilters();
      this.updateLoadMoreButton();
    });

    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });

    this.getFirestoreData();
  }

  getFirestoreData(): void {
    this.firestore
      .collection('post-job')
      .doc<IJobSteps>('job-steps-data')
      .valueChanges()
      .subscribe((doc: IJobSteps | undefined) => {
        this.jobTypes = doc?.jobType ?? [];
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

      const jobTypeMatch = !this.jobTypeFilter || job.jobType === this.jobTypeFilter;

      return (companyMatch || positionMatch || salaryMatch || tagMatch) && jobTypeMatch;
    });

    this.displayedJobsCount = 10;
    this.updateLoadMoreButton();
    this.applySorting();
  }


  applySorting() {
    if (this.sortByPostedTime) {
      this.filteredJobs.sort((a, b) => {
        const dateA = new Date(a.createdTime).getTime();
        const dateB = new Date(b.createdTime).getTime();
        return dateB - dateA;
      });
    }

    if (this.salarySortOption === 'asc') {
      this.filteredJobs.sort((a, b) => {
        const salaryA = a.MaxSalary ?? a.MinSalary ?? 0;
        const salaryB = b.MaxSalary ?? b.MinSalary ?? 0;
        return salaryA - salaryB;
      });
    }

    if (this.salarySortOption === 'desc') {
      this.filteredJobs.sort((a, b) => {
        const salaryA = a.MaxSalary ?? a.MinSalary ?? 0;
        const salaryB = b.MaxSalary ?? b.MinSalary ?? 0;
        return salaryB - salaryA;
      });
    }
  }

  toggleSortByPostedTime() {
    this.sortByPostedTime = !this.sortByPostedTime;
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
