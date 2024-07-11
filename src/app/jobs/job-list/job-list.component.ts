import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job } from '../../modules/job';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  @Output() selectJob = new EventEmitter<Job>();
  jobs$!: Observable<Job[]>;
  tags: string[] = ['Angular', 'React', 'GenAI', 'JavaScript', 'TypeScript'];
  selectedTag: string = '';
  filteredJobs$!: Observable<Job[]>;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.jobs$ = this.firestore.collection<Job>('jobs').valueChanges();
    this.filteredJobs$ = combineLatest([this.jobs$, of(this.selectedTag)]).pipe(
      map(([jobs, tag]) => {
        if (!tag) return jobs;
        return jobs.filter(job => job.Tag === tag);
      })
    );
  }

  onTagFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedTag = target.value;
    this.filteredJobs$ = combineLatest([this.jobs$, of(this.selectedTag)]).pipe(
      map(([jobs, tag]) => {
        if (!tag) return jobs;
        return jobs.filter(job => job.Tag === tag);
      })
    );
  }

  onJobClick(job: Job) {
    this.selectJob.emit(job);
  }
}


/*import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Job } from '../../modules/job';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe
  ],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent implements OnInit {

  @Output() selectJob = new EventEmitter<Job>();
  jobs$?: Observable<Job[]>;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.jobs$ = this.firestore.collection<Job>('jobs').valueChanges();
  }

  onJobClick(job: Job) {
    this.selectJob.emit(job);
  }
}*/
