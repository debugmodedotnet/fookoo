// job.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Job } from '../modules/job';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private firestore: AngularFirestore) { }

  getJobs(): Observable<Job[]> {
    return this.firestore.collection<Job>('jobs').valueChanges();
  }

  getJobById(jobId: string): Observable<Job | undefined> {
    return this.firestore.collection<Job>('jobs').doc(jobId).valueChanges();
  }

  addJob(job: Job): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('jobs').doc(id).set(job);
  }

  updateJob(jobId: string, job: Job): Promise<void> {
    return this.firestore.collection('jobs').doc(jobId).update(job);
  }

  deleteJob(jobId: string): Promise<void> {
    return this.firestore.collection('jobs').doc(jobId).delete();
  }
}


