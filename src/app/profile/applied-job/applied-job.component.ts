import { Component, inject, OnInit } from '@angular/core';
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
  private firestore = inject(AngularFirestore);
  private userService = inject(UserService);

  ngOnInit() {
    this.loadAppliedJobs();
  }

  private loadAppliedJobs() {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        const userId = user.uid;        
        this.firestore.collection(`users/${userId}/appliedJobs`).valueChanges().subscribe(jobs => {
          this.appliedJobs = jobs as Job[];
        });
      }
    });
  }

}