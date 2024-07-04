import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEventSpeakers } from '../../modules/event-speakers';

@Component({
  selector: 'app-event-speakers',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './event-speakers.component.html',
  styleUrl: './event-speakers.component.scss'
})
export class EventSpeakersComponent implements OnInit {

  eventSpeakers?: IEventSpeakers[];

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getEventSpeakers();
  }

  getEventSpeakers() {
    this.firestore.collection('event-details').doc('event-speakers').collection('speakers').valueChanges().subscribe(eventSpeakers => {
      console.log("eventSpeakers:", eventSpeakers);
      this.eventSpeakers = eventSpeakers as IEventSpeakers[];
    });
  }
}