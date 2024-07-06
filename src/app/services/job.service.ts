import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Job } from '../modules/job';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private jobsCollection = this.firestore.collection<Job>('jobs');

  constructor(private firestore: AngularFirestore) { }

  // Method to add a job
  addJob(job: Job): Promise<any> {
    return this.jobsCollection.add(job);
  }

  // Method to get jobs from Firestore
  getJobs(): Observable<Job[]> {
    // Retrieve the collection data from Firestore
    return this.jobsCollection.valueChanges({ idField: 'id' });
  }
}
