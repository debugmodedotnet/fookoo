import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { EventAboutComponent } from './event-about/event-about.component';
import { EventAgendaComponent } from './event-agenda/event-agenda.component';
import { EventSpeakersComponent } from './event-speakers/event-speakers.component';
import { EventVenueComponent } from './event-venue/event-venue.component';
import { EventAttendeesComponent } from './event-attendees/event-attendees.component';
import { IEvent } from '../modules/event';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [DatePipe, RouterModule, EventAboutComponent, EventAgendaComponent, EventSpeakersComponent, EventVenueComponent, EventAttendeesComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {

  event: IEvent | null = null;
  eventId: string | null = null;

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const eventID = this.route.snapshot.paramMap.get('id');
    this.eventId = eventID;
  }

}
