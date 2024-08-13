import { Component } from '@angular/core';

@Component({
  selector: 'app-applied-job',
  standalone: true,
  imports: [],
  templateUrl: './applied-job.component.html',
  styleUrl: './applied-job.component.scss'
})
export class AppliedJobComponent {

  appliedJobs = [
    {
      companyName: 'Google',
      position: 'Software Developer',
      location: 'Bengaluru',
      tag: 'Angular'
    },
    {
      companyName: 'IBM',
      position: 'ML Engineer',
      location: 'Mumbai',
      tag: 'React'
    }
  ];

}
