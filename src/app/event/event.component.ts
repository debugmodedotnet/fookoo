import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEvent } from '../modules/event';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [NgFor, DatePipe],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {

  events: IEvent[] = [];
  private firestore = inject(AngularFirestore);

  constructor() { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.firestore.collection('events').valueChanges().subscribe(events => {
      console.log(events);
      this.events = events as IEvent[];
      //this.events = events.map((event: any) => ({...event,Date:event.Date.toDate()} as IEvent))
    });
  }

}
