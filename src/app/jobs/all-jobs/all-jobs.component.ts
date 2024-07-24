import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, map, Observable, of } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Job } from '../../modules/job';

@Component({
  selector: 'app-all-jobs',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterModule, NgFor],
  templateUrl: './all-jobs.component.html',
  styleUrls: ['./all-jobs.component.scss']
})
export class AllJobsComponent implements OnInit {

  @Output() selectJob = new EventEmitter<Job>();

  jobs$!: Observable<Job[]>;
  tags: string[] = ['All jobs', 'Angular', 'React', 'GenAI', 'JavaScript', 'TypeScript'];
  selectedTag = '';
  filteredJobs$!: Observable<Job[]>;
  displayedJobs: Job[] = [];
  itemsPerPage = 2;
  currentPage = 0;
  totalJobs = 0;

  constructor(private firestore: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.selectedTag = localStorage.getItem('selectedTag') || 'All jobs';
    this.jobs$ = this.firestore.collection<Job>('jobs').valueChanges({ idField: 'id' });
    this.jobs$.subscribe(jobs => {
      this.totalJobs = jobs.length;
      this.updateFilteredJobs();
    });
  }

  onTagFilterChange(tag: string) {
    this.selectedTag = tag;
    localStorage.setItem('selectedTag', tag);
    this.currentPage = 0; // Reset pagination
    this.updateFilteredJobs();
  }

  updateFilteredJobs() {
    this.filteredJobs$ = combineLatest([this.jobs$, of(this.selectedTag)]).pipe(
      map(([jobs, selectedTag]) => {
        if (selectedTag === 'All jobs') {
          // Apply pagination only for "All jobs"
          console.log(selectedTag);
          const paginatedJobs = jobs.slice(0, this.itemsPerPage * (this.currentPage + 1));
          console.log(paginatedJobs);
          return paginatedJobs;
        } else {
          // Filter jobs based on the selected tag without pagination
          return jobs.filter(job => job.Tag === selectedTag);
        }
      })
    );

    this.filteredJobs$.subscribe(jobs => {
      this.displayedJobs = jobs;
      console.log(this.displayedJobs);
    });
  }

  loadMore() {
    if (this.selectedTag === 'All jobs') {
      this.currentPage++;
      this.updateFilteredJobs();
    }
  }

  showLess() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateFilteredJobs();
    }
  }
  

  isTagActive(tag: string): boolean {
    return this.selectedTag === tag;
  }

}


/*import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, map, Observable, of } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Job } from '../../modules/job';

@Component({
  selector: 'app-all-jobs',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterModule, NgFor, NgIf],
  templateUrl: './all-jobs.component.html',
  styleUrl: './all-jobs.component.scss'
})
export class AllJobsComponent implements OnInit {

  @Output() selectJob = new EventEmitter<Job>();

  jobs$!: Observable<Job[]>;
  tags: string[] = ['All jobs','Angular', 'React', 'GenAI', 'JavaScript', 'TypeScript'];
  selectedTag = '';
  filteredJobs$!: Observable<Job[]>;
  displayedJobs: Job[] = [];
  itemsPerPage = 2;
  currentPage = 0;


  constructor(private firestore: AngularFirestore, private router: Router) { }


  ngOnInit() {
    //this.jobs$ = this.firestore.collection<Job>('jobs').valueChanges();
    this.selectedTag = localStorage.getItem('selectedTag') || 'All jobs';
    this.jobs$ = this.firestore.collection<Job>('jobs').valueChanges({ idField: 'id' });
    this.updateFilteredJobs();
  }

  onTagFilterChange(tag: string) {
    this.selectedTag = tag;
    localStorage.setItem('selectedTag', tag);
    this.currentPage = 0;
    this.updateFilteredJobs();
  }

  updateFilteredJobs() {
    this.filteredJobs$ = combineLatest([this.jobs$, of(this.selectedTag)]).pipe(
      map(([jobs, selectedTag]) => {
        if (selectedTag === 'All jobs') return jobs;
        return jobs.filter(job => job.Tag === selectedTag);
      }),
      map(filteredJobs => {
        // Update the displayed jobs based on the current page
        return filteredJobs.slice(0, this.itemsPerPage * (this.currentPage + 1));
      })
    );

    this.filteredJobs$.subscribe(jobs => this.displayedJobs = jobs);
  }

  // onJobClick(job: Job) {
  //   this.selectJob.emit(job);
  //   this.router.navigate(['/jobs', job.id]);
  // }

  loadMore() {
    this.currentPage++;
    this.updateFilteredJobs();
  }

  isTagActive(tag: string): boolean {
    return this.selectedTag === tag;
  }

} */
