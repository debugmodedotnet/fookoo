import { Component, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEventAttendees } from '../../modules/event-attendees';

@Component({
  selector: 'app-event-attendees',
  standalone: true,
  imports: [],
  templateUrl: './event-attendees.component.html',
  styleUrl: './event-attendees.component.scss'
})
export class EventAttendeesComponent implements OnInit {

  eventAttendees?: IEventAttendees[];
  userDefaultImg = 'assets/images/home/defaultUser.jpg';

  @Input() eventId: string | null = null;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    if (this.eventId) {
      this.getEventAttendees(this.eventId);
    }
  }

  getEventAttendees(eventId: string) {
    this.firestore.collection('event-transactions').doc(eventId).collection('users').valueChanges().subscribe(eventAttendees => {
      console.log("eventAttendees:", eventAttendees);
      this.eventAttendees = eventAttendees as IEventAttendees[];
    });
  }


}
