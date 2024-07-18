import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEvent } from '../modules/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private firestore: AngularFirestore) { }

  getEvents(): Observable<IEvent[]> {
    return this.firestore.collection<IEvent>('events').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IEvent;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }


  addEvent(event: IEvent, slug: string) {
    console.log('Adding event:', event);
    return this.firestore.collection('events').doc(slug).set(event);
  }

  updateEvent(id: string, event: IEvent) {
    return this.firestore.doc(`events/${id}`).update(event);
  }

  deleteEvent(id: string) {
    return this.firestore.doc(`events/${id}`).delete();
  }

}
