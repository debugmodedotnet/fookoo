import { Component,Input, OnInit } from '@angular/core';
import { Job } from '../../modules/job';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { JobService } from '../../services/job.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  @Input() jobID!: string;
  job$: Observable<Job | undefined>;

  constructor(private jobService: JobService, private route: ActivatedRoute) {
    this.job$ = new Observable(); // Initialize as empty observable
  }

  ngOnInit(): void {
    if (this.jobID) {
      this.job$ = this.jobService.getJobById(this.jobID);
    } else {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id')!;
        this.job$ = this.jobService.getJobById(id);
      });
    }
  }



  /*
  //  @Input() job: Job | null = null;
  //  @Input() jobID: string | null = null;

  job = model<Job | null>();
  jobID = model<string | null>();

  constructor() {
    console.log(this.jobID());
    console.log(this.job());
   }
    */
}
