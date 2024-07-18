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
  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    // this.firestore.collection('events').valueChanges().subscribe(events => {
    //   console.log(events);
    //   this.events = events as IEvent[];
    //   //this.events = events.map((event: any) => ({...event,Date:event.Date.toDate()} as IEvent))
    // });

    this.firestore.collection('events').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IEvent;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(events => {
      console.log(events);
      this.events = events as IEvent[];
    });
  }



}
