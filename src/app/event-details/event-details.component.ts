import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEventAbout } from '../modules/about-event';
import { IEventAgenda } from '../modules/event-agenda';
import { IEventAttendees } from '../modules/event-attendees';
import { IEventVenue } from '../modules/event-venue';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IEventEnroll } from '../modules/event-enroll';
import { IEventSpeakers } from '../modules/event-speakers';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, DatePipe, NgFor],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {

  eventAbout?: IEventAbout;
  eventAgenda?: IEventAgenda[];
  eventSpeakers?: IEventSpeakers[];
  eventVenue?: IEventVenue;
  eventEnroll?: IEventEnroll;
  eventAttendees?: IEventAttendees[];

  safeUrl?: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) { }

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getEventDetails();
  }

  getEventDetails() {
    this.firestore.collection('event-details').doc('about-event').valueChanges().subscribe(eventAbout => {
      console.log("eventAbout:", eventAbout);
      this.eventAbout = eventAbout as IEventAbout;
    });

    this.firestore.collection('event-details').doc('event-agenda').collection('agendas').valueChanges().subscribe(eventAgenda => {
      console.log("eventAgenda:", eventAgenda);
      this.eventAgenda = eventAgenda as IEventAgenda[];
    });

    this.firestore.collection('event-details').doc('event-speakers').collection('speakers').valueChanges().subscribe(eventSpeakers => {
      console.log("eventSpeakers:", eventSpeakers);
      this.eventSpeakers = eventSpeakers as IEventSpeakers[];
    });

    this.firestore.collection('event-details').doc('event-venue').valueChanges().subscribe(eventVenue => {
      console.log("eventVenue:", eventVenue);
      this.eventVenue = eventVenue as IEventVenue;
      if (this.eventVenue?.VenueMap) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.eventVenue.VenueMap);
      }
    });

    this.firestore.collection('event-details').doc('enroll-now').valueChanges().subscribe(eventEnroll => {
      console.log("eventEnroll:", eventEnroll);
      this.eventEnroll = eventEnroll as IEventEnroll;
    });

    this.firestore.collection('event-details').doc('who-all-attending').collection('attendees').valueChanges().subscribe(eventAttendees => {
      console.log("eventAttendees:", eventAttendees);
      this.eventAttendees = eventAttendees as IEventAttendees[];
    });
  }

}
