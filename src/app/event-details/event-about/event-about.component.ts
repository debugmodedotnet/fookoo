import { Component, OnInit, inject } from '@angular/core';
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

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getEventDetails();
  }

  getEventDetails() {
    this.firestore.collection('event-details').doc('about-event').valueChanges().subscribe(eventAbout => {
      console.log("eventAbout:", eventAbout);
      this.eventAbout = eventAbout as IEventAbout;
    });
  }

}
