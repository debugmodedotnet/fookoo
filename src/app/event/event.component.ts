import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {doc,getDoc} from '@angular/fire/firestore';
import { IEvent } from '../event';
import { DatePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [NgFor, DatePipe],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit , OnChanges {



  events: IEvent[] = [];
  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.getEvents();
  }

  ngOnChanges(changes: SimpleChanges): void {
     
  }

  getEvents() {
    this.firestore.collection('1').valueChanges().subscribe(events => {
      console.log(events);
      //this.events = events as IEvent[];
      this.events = events.map((event: any) => ({...event,Date:event.Date.toDate()} as IEvent))
    });
  }

 
}
