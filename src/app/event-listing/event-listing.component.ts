import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterModule } from '@angular/router';
import { IEvent } from '../modules/event';
import { map } from 'rxjs';

@Component({
  selector: 'app-event-listing',
  standalone: true,
  imports: [DatePipe, RouterModule],
  templateUrl: './event-listing.component.html',
  styleUrl: './event-listing.component.scss'
})
export class EventListingComponent implements OnInit {

  events: IEvent[] = [];
  showLoadMoreButton = false;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.firestore.collection('events').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IEvent;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(events => {
      this.events = events as IEvent[];
      this.showLoadMoreButton = this.events.length > 8;
    });
  }

  loadMore() {
    return true;
  }

}
