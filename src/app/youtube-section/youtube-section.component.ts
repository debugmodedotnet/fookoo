import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterModule } from '@angular/router';
import { IYoutubeVideos } from '../modules/home-youtube';

@Component({
  selector: 'app-youtube-section',
  standalone: true,
  imports: [NgFor, DatePipe, RouterModule],
  templateUrl: './youtube-section.component.html',
  styleUrl: './youtube-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class YoutubeSectionComponent implements OnInit {

  youtubeVideos: IYoutubeVideos[] = [];
  private firestore = inject(AngularFirestore);

  constructor() { }

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
