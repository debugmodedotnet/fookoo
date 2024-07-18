import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job } from '../../modules/job';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgClass],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  @Input() selectedTag: string | null = null;
  @Input() selectedJob: Job | null = null;
  @Output() selectJob = new EventEmitter<Job>();

  jobs$!: Observable<Job[]>;
  /*selectedTag = '';*/
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

  ngOnChanges() {
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
    this.selectedJob = job; // Update selected job
    this.selectJob.emit(job); // Emit selected job to parent component
  }

}
