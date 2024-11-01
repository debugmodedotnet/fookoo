import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterModule } from '@angular/router';
import { IEvent } from '../modules/event';
import { map } from 'rxjs';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [DatePipe, RouterModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {

  events: IEvent[] = [];
  defaultImage = 'assets/images/events/event_default.svg';
  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.firestore.collection('events', ref => ref.limit(3)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IEvent;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(events => {
      this.events = events as IEvent[];
    });
  }

}
