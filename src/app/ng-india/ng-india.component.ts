import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { YouTubePlayer } from '@angular/youtube-player';
import { INgIndia } from '../modules/ng-india';
import { map } from 'rxjs';
import { IPrevEvents, ISpeaker, ISponsor } from '../modules/prev-events';
import { DatePipe } from '@angular/common';
import { NgIndiaEditionComponent } from '../ng-india-edition/ng-india-edition.component';

@Component({
  selector: 'app-ng-india',
  standalone: true,
  imports: [YouTubePlayer, DatePipe, NgIndiaEditionComponent],
  templateUrl: './ng-india.component.html',
  styleUrl: './ng-india.component.scss'
})
export class NgIndiaComponent implements OnInit {

  ngIndia?: INgIndia;
  prevEvents?: IPrevEvents[] = [];
  selectedTab: number | string = 0;

  defaultSpeakerImage = 'assets/images/home/defaultInstructor.jpg';
  defaultSponsorImage = 'assets/images/home/noImage.png';

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getBannerDetails();
    this.getPrevEvents();
  }

  selectTab(index: number | string): void {
    this.selectedTab = index;
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
      this.prevEvents.forEach(event => this.loadSpeakersForEvent(event));
      this.prevEvents.forEach(event => this.loadSponsorsForEvent(event));
    });
  }

  loadSpeakersForEvent(event: IPrevEvents) {
    this.firestore.collection('ng-india').doc('previous-events').collection('events-list').doc(event.id).collection('speakers').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ISpeaker;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(speakers => {
      event.SpeakersCollection = speakers;
    });
  }

  loadSponsorsForEvent(event: IPrevEvents) {
    this.firestore.collection('ng-india').doc('previous-events').collection('events-list').doc(event.id).collection('sponsors').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ISponsor;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(sponsors => {
      event.SponsorsCollection = sponsors;
    });
  }
}
