import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { EventComponent } from '../event/event.component';
import { InstructorsComponent } from '../instructors/instructors.component';
import { YoutubeSectionComponent } from '../youtube-section/youtube-section.component';
import { JobsSectionComponent } from '../jobs-section/jobs-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, EventComponent, InstructorsComponent, YoutubeSectionComponent, JobsSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
