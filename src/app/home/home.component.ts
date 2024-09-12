import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { EventComponent } from '../event/event.component';
import { InstructorsComponent } from '../instructors/instructors.component';
import { YoutubeSectionComponent } from '../youtube-section/youtube-section.component';
import { JobsSectionComponent } from '../jobs-section/jobs-section.component';
import { HeroTechComponent } from '../hero-tech/hero-tech.component';
import { NewsletterComponent } from '../newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, HeroTechComponent, EventComponent, InstructorsComponent, YoutubeSectionComponent, JobsSectionComponent, NewsletterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
