import { CommonModule } from '@angular/common';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-jobs-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobs-section.component.html',
  styleUrl: './jobs-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobsSectionComponent {


}
