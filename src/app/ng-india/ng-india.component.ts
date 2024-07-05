import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { YouTubePlayer } from '@angular/youtube-player';
import { INgIndia } from '../modules/ng-india';
import { map } from 'rxjs';
import { IPrevEvents } from '../modules/prev-events';
import { DatePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-ng-india',
  standalone: true,
  imports: [YouTubePlayer, DatePipe, NgFor],
  templateUrl: './ng-india.component.html',
  styleUrl: './ng-india.component.scss'
})
export class NgIndiaComponent implements OnInit {

  ngIndia?: INgIndia;
  prevEvents?: IPrevEvents[] = [];

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {

    this.getBannerDetails();
    this.getPrevEvents();
  }

  getBannerDetails() {
    this.firestore.collection('ng-india').doc('about-ng-india').valueChanges().subscribe(ngIndia => {
      console.log("ngIndia:", ngIndia);
      this.ngIndia = ngIndia as INgIndia;
    });
  }

  getPrevEvents() {
    this.firestore.collection('ng-india').doc('previous-events').collection('events-list').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IPrevEvents;
        const id = a.payload.doc.id;
        return { id, ...data };
      })), map(prevEvents => prevEvents.reverse())
    ).subscribe(prevEvents => {
      console.log(prevEvents);
      this.prevEvents = prevEvents;
    });
  }

}
