import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { map, Observable, of } from 'rxjs';
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
  defaultImage = 'assets/images/home/default_company.png';

  jobs$: Observable<Job[]> = of([]);
  tags: string[] = ['All jobs', 'Angular', 'React', 'GenAI', 'JavaScript', 'TypeScript'];
  selectedTag = '';
  displayedJobs: Job[] = [];
  itemsPerPage = 2;
  currentPage = 0;
  lastDoc: QueryDocumentSnapshot<Job> | null = null;
  totalJobs = 0; // Maintain the total number of jobs to control the "Load More" visibility

  constructor(private firestore: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.selectedTag = localStorage.getItem('selectedTag') || 'All jobs';
    this.updateFilteredJobs();
  }

  onTagFilterChange(tag: string) {
    this.selectedTag = tag;
    localStorage.setItem('selectedTag', tag);
    this.currentPage = 0; // Reset pagination
    this.lastDoc = null; // Reset cursor
    this.displayedJobs = []; // Clear displayed jobs
    this.updateFilteredJobs();
  }

  updateFilteredJobs() {
    if (this.selectedTag === 'All jobs') {
      this.getPaginatedJobs().subscribe(jobs => {
        this.displayedJobs = [...this.displayedJobs, ...jobs];
        this.totalJobs = jobs.length;
      });
    } else {
      this.getJobsByTag(this.selectedTag).subscribe(jobs => {
        this.displayedJobs = jobs;
      });
    }
  }

  getJobsByTag(tag: string): Observable<Job[]> {
    return this.firestore.collection<Job>('jobs', ref =>
      ref.where('Tag', '==', tag)).valueChanges({ idField: 'id' });
  }

  getPaginatedJobs(): Observable<Job[]> {
    let queryRef = this.firestore.collection<Job>('jobs', ref =>
      ref.orderBy('Position') // Adjust ordering based on your data
        .limit(this.itemsPerPage));

    if (this.lastDoc) {
      queryRef = this.firestore.collection<Job>('jobs', ref =>
        ref.orderBy('Position')
          .startAfter(this.lastDoc)
          .limit(this.itemsPerPage));
    }

    return queryRef.get().pipe(
      map((querySnapshot: QuerySnapshot<Job>) => {
        const jobs = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return { ...data, id } as Job; // Properly typecast
        });
        if (jobs.length > 0) {
          this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        }
        return jobs;
      })
    );
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
