import { Component, OnInit, inject } from '@angular/core';
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
  imports: [RouterModule, EventAboutComponent, EventAgendaComponent, EventSpeakersComponent, EventVenueComponent, EventAttendeesComponent],
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

  shareOnLinkedIn(): void {
    const title = this.event?.Title || '';
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}`;
    window.open(url, '_blank');
  }

  shareOnWhatsApp(): void {
    const title = this.event?.Title || '';
    const url = `https://wa.me/?text=${encodeURIComponent(title + ' - ' + window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnTwitter(): void {
    const title = this.event?.Title || '';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnInstagram(): void {
    alert('Instagram sharing is not supported directly via a URL.');
  }

}
