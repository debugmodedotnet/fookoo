import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private firestore: AngularFirestore) { }

  // Method to add a job
  addJob(job: any): Promise<any> {
    return this.firestore.collection('jobs').add(job);
  }
  
  // Method to get all jobs
  getJobs(): Observable<any[]> {
    return this.firestore.collection('jobs').valueChanges();
  }
}

