import { Component, model } from '@angular/core';
import { Job } from '../../modules/job';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.scss'
})
export class JobDetailComponent {

  //  @Input() job: Job | null = null;
  //  @Input() jobID: string | null = null;

  job = model<Job | null>();
  jobID = model<string | null>();

  constructor() {
    console.log(this.jobID());
    console.log(this.job());
   }

}
