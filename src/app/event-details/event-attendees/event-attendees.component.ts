import { Component, OnInit, inject } from '@angular/core';
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

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getEventAttendees();
  }

  getEventAttendees() {
    this.firestore.collection('event-details').doc('who-all-attending').collection('attendees').valueChanges().subscribe(eventAttendees => {
      console.log("eventAttendees:", eventAttendees);
      this.eventAttendees = eventAttendees as IEventAttendees[];
    });
  }

}
