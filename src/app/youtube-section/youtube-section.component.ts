import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterModule } from '@angular/router';
import { IYoutubeVideos } from '../modules/home-youtube';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-youtube-section',
  standalone: true,
  imports: [NgFor, DatePipe, RouterModule, YouTubePlayer],
  templateUrl: './youtube-section.component.html',
  styleUrl: './youtube-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class YoutubeSectionComponent implements OnInit {

  youtubeVideos: IYoutubeVideos[] = [];
  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.firestore.collection('homepagedata').doc('learn-youtube').collection('youtube-videos').valueChanges().subscribe(youtubeVideos => {
      console.log(youtubeVideos);
      this.youtubeVideos = youtubeVideos as IYoutubeVideos[];
    });
  }

}
