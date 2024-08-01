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
    return this.firestore.collection<Job>('jobForms').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Job;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getJobsByUserId(userId: string): Observable<Job[]> {
    return this.firestore.collection<Job>('jobForms', ref => ref.where('userId', '==', userId)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Job;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getJobById(jobId: string): Observable<Job | undefined> {
    return this.firestore.collection('jobForms').doc<Job>(jobId).valueChanges().pipe(
      map(data => data ? { id: jobId, ...data } : undefined)
    );
  }

  getLimitedJobs(limit: number): Observable<Job[]> {
    return this.firestore.collection<Job>('jobForms', ref => ref.limit(limit)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Job;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  async addJob(job: Job): Promise<string> {
    const jobRef = await this.firestore.collection('jobForms').add(job);
    return jobRef.id;
  }

  updateJob(jobId: string, job: Partial<Job>): Promise<void> {
    return this.firestore.collection('jobForms').doc(jobId).update(job);
  }

  deleteJob(jobId: string): Promise<void> {
    return this.firestore.collection('jobForms').doc(jobId).delete();
  }

  async saveStepData(jobId: string, step: number, data: Partial<Job>): Promise<void> {
    await this.firestore.collection('jobForms').doc(jobId).collection('steps').doc(`step${step}`).set(data);
  }

  getStepData(jobId: string, step: number): Observable<Partial<Job> | undefined> {
    return this.firestore.collection('jobForms').doc(jobId).collection('steps').doc(`step${step}`).valueChanges().pipe(
      map(data => data as Partial<Job> | undefined)
    );
  }

  async updateStepData(jobId: string, step: number, data: Partial<Job>): Promise<void> {
    await this.firestore.collection('jobForms').doc(jobId).collection('steps').doc(`step${step}`).update(data);
  }
}