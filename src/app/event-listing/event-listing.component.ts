import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterModule } from '@angular/router';
import { IEvent } from '../modules/event';
import { map } from 'rxjs';

@Component({
  selector: 'app-event-listing',
  standalone: true,
  imports: [DatePipe, RouterModule, SlicePipe],
  templateUrl: './event-listing.component.html',
  styleUrl: './event-listing.component.scss'
})
export class EventListingComponent implements OnInit {

  events: IEvent[] = [];
  showLoadMoreButton = false;
  displayedEventsCount = 10;

  private firestore = inject(AngularFirestore);

  ngOnInit() {
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
      //this.showLoadMoreButton = this.events.length > 8;
      this.updateLoadMoreButton();
    });
  }

  loadMore() {
    this.displayedEventsCount += 10;
    this.updateLoadMoreButton();
  }

  updateLoadMoreButton() {
    this.showLoadMoreButton = this.events.length > this.displayedEventsCount;
  }

}
