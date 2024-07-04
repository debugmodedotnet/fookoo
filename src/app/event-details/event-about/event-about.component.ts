import { Component, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEventAbout } from '../../modules/about-event';

@Component({
  selector: 'app-event-about',
  standalone: true,
  imports: [],
  templateUrl: './event-about.component.html',
  styleUrl: './event-about.component.scss'
})
export class EventAboutComponent implements OnInit {

  eventAbout?: IEventAbout;

  @Input() eventId: string | null = null;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    if (this.eventId) {
      this.getEventDetails(this.eventId);
    }
  }

  getEventDetails(eventId: string) {
    this.firestore.collection('events').doc(eventId).valueChanges().subscribe(eventAbout => {
      console.log("eventAbout:", eventAbout);
      this.eventAbout = eventAbout as IEventAbout;
    });
  }

}
