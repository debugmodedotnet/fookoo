import { Component, Input } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { IPrevEvents } from '../modules/prev-events';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-ng-india-edition',
  standalone: true,
  imports: [DatePipe, YouTubePlayer, NgFor],
  templateUrl: './ng-india-edition.component.html',
  styleUrl: './ng-india-edition.component.scss'
})
export class NgIndiaEditionComponent {

  @Input() event?: IPrevEvents;
  defaultSpeakerImage = 'assets/images/home/defaultInstructor.jpg';
  defaultSponsorImage = 'assets/images/home/noImage.png';

}
