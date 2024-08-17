import { Component, inject, Input, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IPrevEvents } from '../modules/prev-events';
import { YouTubePlayer } from '@angular/youtube-player';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ng-india-edition',
  standalone: true,
  imports: [DatePipe, YouTubePlayer],
  templateUrl: './ng-india-edition.component.html',
  styleUrl: './ng-india-edition.component.scss'
})
export class NgIndiaEditionComponent implements OnChanges {

  @Input() event?: IPrevEvents;
  defaultSpeakerImage = 'assets/images/home/defaultInstructor.jpg';
  defaultSponsorImage = 'assets/images/home/noImage.png';

  safeVideoUrl?: SafeResourceUrl;
  private sanitizer = inject(DomSanitizer);

  ngOnChanges(): void {
    if (this.event?.SummaryVideoId) {
      this.safeVideoUrl = this.getSafeUrl(this.event.SummaryVideoId);
    }
  }

  getSafeUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

}
