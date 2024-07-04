import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEventAgenda } from '../../modules/event-agenda';

@Component({
  selector: 'app-event-agenda',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './event-agenda.component.html',
  styleUrl: './event-agenda.component.scss'
})
export class EventAgendaComponent implements OnInit {

  eventAgenda?: IEventAgenda[];

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getEventAgenda();
  }

  getEventAgenda() {
    this.firestore.collection('event-details').doc('event-agenda').collection('agendas').valueChanges().subscribe(eventAgenda => {
      console.log("eventAgenda:", eventAgenda);
      this.eventAgenda = eventAgenda as IEventAgenda[];
    });
  }

}
