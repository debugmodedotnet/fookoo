import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';
import { Job } from '../modules/job';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-jobs-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './jobs-section.component.html',
  styleUrl: './jobs-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobsSectionComponent implements OnInit {

  jobs$: Observable<Job[]> = of([]);

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.jobs$ = this.jobService.getJobs();
  }

  getColorClass(index: number): string {
    const colorClasses = [
      'purple-bg-gradient',
      'orange-bg-gradient',
      'blue-bg-gradient',
      'green-bg-gradient',
      'pink-bg-gradient',
      'yellow-bg-gradient',
      'red-bg-gradient'
    ];
    return colorClasses[index % colorClasses.length];
  }
}
