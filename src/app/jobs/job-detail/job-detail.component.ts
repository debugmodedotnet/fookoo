import { Component, Input} from '@angular/core';
import { Job } from '../../modules/job';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.scss'
})
export class JobDetailComponent {
  @Input() job: Job | null = null;
}
