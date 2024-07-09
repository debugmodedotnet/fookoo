import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Job } from '../modules/job';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private firestore: AngularFirestore) {}

  // Fetch jobs with the document ID included
  getJobs(): Observable<Job[]> {
    return this.firestore.collection<Job>('jobs').valueChanges({ idField: 'id' });
  }

  getJobById(id: string): Observable<Job | undefined> {
    return this.firestore.collection<Job>('jobs').doc(id).valueChanges();
  }

  addJob(job: Job): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('jobs').doc(id).set({ ...job, id });
  }

  updateJob(id: string, job: Job): Promise<void> {
    return this.firestore.collection('jobs').doc(id).update(job);
  }

  deleteJob(id: string): Promise<void> {
    return this.firestore.collection('jobs').doc(id).delete();
  }
}



