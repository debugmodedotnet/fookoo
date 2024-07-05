import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import GLightbox from 'glightbox';

@Component({
  selector: 'app-ng-india',
  standalone: true,
  imports: [],
  templateUrl: './ng-india.component.html',
  styleUrl: './ng-india.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NgIndiaComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const gallery = GLightbox({
      selector: 'a.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
    });
  }

}
