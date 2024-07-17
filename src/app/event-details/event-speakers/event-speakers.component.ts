import { Component, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEventSpeakers } from '../../modules/event-speakers';
import { map } from 'rxjs';

@Component({
  selector: 'app-event-speakers',
  standalone: true,
  imports: [],
  templateUrl: './event-speakers.component.html',
  styleUrl: './event-speakers.component.scss'
})
export class EventSpeakersComponent implements OnInit {

  eventSpeakers?: IEventSpeakers[];

  @Input() eventId: string | null = null;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    if (this.eventId) {
      this.getEventSpeakers(this.eventId);
    }
  }

  getEventSpeakers(eventId: string) {
    this.firestore.collection('events').doc(eventId).collection('speakers').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IEventSpeakers;
        const id = a.payload.doc.id;
        return { id, ...data };
      })), map(eventSpeakers => eventSpeakers.reverse())
    ).subscribe(eventSpeakers => {
      console.log("eventSpeakers:", eventSpeakers);
      this.eventSpeakers = eventSpeakers;
    });
  }

}
