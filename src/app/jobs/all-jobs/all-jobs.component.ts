import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Job } from '../../modules/job';
import { combineLatest, map, Observable, of } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-jobs',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterModule],
  templateUrl: './all-jobs.component.html',
  styleUrl: './all-jobs.component.scss'
})
export class AllJobsComponent implements OnInit {

  @Output() selectJob = new EventEmitter<Job>();

  jobs$!: Observable<Job[]>;
  tags: string[] = ['Angular', 'React', 'GenAI', 'JavaScript', 'TypeScript'];
  selectedTag = '';
  filteredJobs$!: Observable<Job[]>;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.jobs$ = this.firestore.collection<Job>('jobs').valueChanges();
    this.updateFilteredJobs();
  }

  onTagFilterChange(tag: string) {
    this.selectedTag = tag;
    this.updateFilteredJobs();
  }

  updateFilteredJobs() {
    this.filteredJobs$ = combineLatest([this.jobs$, of(this.selectedTag)]).pipe(
      map(([jobs, selectedTag]) => {
        if (!selectedTag) return jobs;
        return jobs.filter(job => job.Tag === selectedTag);
      })
    );
  }

  onJobClick(job: Job) {
    this.selectJob.emit(job);
  }

}
