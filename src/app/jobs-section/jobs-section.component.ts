import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';
import { Job } from '../modules/job';
import { map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimeAgoPipePipe } from '../pipes/time-ago-pipe.pipe';

@Component({
  selector: 'app-jobs-section',
  standalone: true,
  imports: [AsyncPipe, RouterModule, TimeAgoPipePipe],
  templateUrl: './jobs-section.component.html',
  styleUrl: './jobs-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobsSectionComponent implements OnInit {

  jobs$: Observable<Job[]> = of([]);

  defaultImage = 'assets/images/home/default_company.png';

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.jobs$ = this.jobService.getJobs().pipe(
      map(jobs => jobs.filter(job => job.companyName).slice(0, 4)),
    );
  }
}
