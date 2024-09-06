import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AsyncPipe } from '@angular/common';
import { Job } from '../../modules/job';

@Component({
  selector: 'app-applied-job',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './applied-job.component.html',
  styleUrl: './applied-job.component.scss'
})
export class AppliedJobComponent implements OnInit {

  appliedJobs: Job[] = [];

  constructor(
    private firestore: AngularFirestore,
    private userService: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    const user = await this.userService.getCurrentUser().toPromise();
    if (user?.uid) {
      await this.loadAppliedJobs(user.uid);
    }
  }

  async loadAppliedJobs(userId: string): Promise<void> {
    try {
      const jobSnapshots = await this.firestore.collection('job-transactions').ref.get();
      const jobs: Job[] = [];

      for (const jobSnapshot of jobSnapshots.docs) {
        const userApplication = await this.firestore.collection(`job-transactions/${jobSnapshot.id}/users`).doc(userId).ref.get();

    
        if (userApplication.exists) {
          const jobDoc = await this.firestore.doc<Job>(`jobForms/${jobSnapshot.id}`).ref.get();
          if (jobDoc.exists) {
            jobs.push(jobDoc.data() as Job);
          }
        }
      }

      this.appliedJobs = jobs;

    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  }
}