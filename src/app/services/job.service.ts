import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Job } from '../modules/job';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private firestore: AngularFirestore) { }

  getJobs(): Observable<Job[]> {
    return this.firestore.collection<Job>('jobs').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Job;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getJobsByUserId(userId: string): Observable<Job[]> {
    return this.firestore.collection<Job>('jobs', ref => ref.where('userId', '==', userId)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Job;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  async addJob(job: Job): Promise<string> {
    const jobRef = await this.firestore.collection('jobs').add(job);
    return jobRef.id;
  }

  getJobById(jobId: string): Observable<Job | undefined> {
    return this.firestore.collection('jobForms').doc<Job>(jobId).valueChanges().pipe(
      map(data => data ? { id: jobId, ...data } : undefined)
    );
  }

  updateJob(jobId: string, job: Partial<Job>): Promise<void> {
    return this.firestore.collection('jobs').doc(jobId).update(job);
  }

  deleteJob(jobId: string): Promise<void> {
    return this.firestore.collection('jobs').doc(jobId).delete();
  }

  async saveStepData(jobId: string, step: number, data: Partial<Job>): Promise<void> {
    await this.firestore.collection('jobs').doc(jobId).collection('steps').doc(`step${step}`).set(data);
  }

  getStepData(jobId: string, step: number): Observable<Partial<Job> | undefined> {
    return this.firestore.collection('jobs').doc(jobId).collection('steps').doc(`step${step}`).valueChanges().pipe(
      map(data => data as Partial<Job> | undefined)
    );
  }

  async updateStepData(jobId: string, step: number, data: Partial<Job>): Promise<void> {
    await this.firestore.collection('jobs').doc(jobId).collection('steps').doc(`step${step}`).update(data);
  }
}