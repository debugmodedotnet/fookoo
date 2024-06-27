import { HeroComponent } from '../hero/hero.component';
import { Component } from '@angular/core';
import { EventComponent } from '../event/event.component';
import { InstructorsComponent } from '../instructors/instructors.component';
import { YoutubeSectionComponent } from '../youtube-section/youtube-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, EventComponent, InstructorsComponent, YoutubeSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
