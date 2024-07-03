import { Component } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EventAboutComponent } from './event-about/event-about.component';
import { EventAgendaComponent } from './event-agenda/event-agenda.component';
import { EventSpeakersComponent } from './event-speakers/event-speakers.component';
import { EventVenueComponent } from './event-venue/event-venue.component';
import { EventAttendeesComponent } from './event-attendees/event-attendees.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [NgFor, DatePipe, RouterModule, EventAboutComponent, EventAgendaComponent, EventSpeakersComponent, EventVenueComponent, EventAttendeesComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent   {

  
}
