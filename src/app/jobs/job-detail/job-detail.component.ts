import { Component, Input } from '@angular/core';
import { Job } from '../../modules/job';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [NgIf],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.scss'
})
export class JobDetailComponent {

  @Input() job: Job | null = null;

}
