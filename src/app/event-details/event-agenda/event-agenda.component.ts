import { Component, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEventAgenda } from '../../modules/event-agenda';
import { map } from 'rxjs';

@Component({
  selector: 'app-event-agenda',
  standalone: true,
  imports: [],
  templateUrl: './event-agenda.component.html',
  styleUrl: './event-agenda.component.scss'
})
export class EventAgendaComponent implements OnInit {

  eventAgenda?: IEventAgenda[];

  @Input() eventId: string | null = null;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    if (this.eventId) {
      this.getEventAgenda(this.eventId);
    }
  }

  getEventAgenda(eventId: string) {
    this.firestore.collection('events').doc(eventId).collection('agenda').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IEventAgenda;
        const id = a.payload.doc.id;
        return { id, ...data };
      })), map(eventAgenda => eventAgenda)
    ).subscribe(eventAgenda => {
      console.log("eventAgenda:", eventAgenda);
      this.eventAgenda = eventAgenda;
    });
  }  

}
