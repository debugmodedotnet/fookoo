import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Job } from '../../modules/job';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent implements OnInit {
  @Output() selectJob = new EventEmitter<Job>();
  jobs$: Observable<Job[]>;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.jobs$ = this.firestore.collection<Job>('jobs').valueChanges();
  }

  onJobClick(job: Job) {
    this.selectJob.emit(job);
  }
}
