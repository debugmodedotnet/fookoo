import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { JobService } from '../job.service';
import { Job } from '../job';
import { Observable, of } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-jobs-section',
  standalone: true,
  imports: [CommonModule,NgFor],
  templateUrl: './jobs-section.component.html',
  styleUrl: './jobs-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobsSectionComponent implements OnInit{
  jobs$: Observable<Job[]> = of([]);

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.jobs$ = this.jobService.getJobs(); // Assign observable to jobs$
  }

  // Method to get a color class based on index
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
