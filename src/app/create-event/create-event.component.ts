import { Component, inject } from '@angular/core';
import { AddSpeakersComponent } from "./add-speakers/add-speakers.component";
import { AddAgendaComponent } from "./add-agenda/add-agenda.component";
import { AddBasicsComponent } from "./add-basics/add-basics.component";
import { CreateEventService } from '../services/create-event.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [AddSpeakersComponent, AddAgendaComponent, AddBasicsComponent],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {

  eventId = '';

  private createEventService = inject(CreateEventService);

  handleEventIdCreated(eventId: string): void {
    this.eventId = eventId;
    this.createEventService.setEventId(eventId);  
    
    this.goToNextTab(0, eventId);
  }

  goToNextTab(currentTabIndex: number, eventId: string): void {
    this.eventId = eventId;
    this.createEventService.setEventId(eventId);
    
    const tabIds = ['home-tab', 'profile-tab', 'contact-tab'];
    const paneIds = ['home-tab-pane', 'profile-tab-pane', 'contact-tab-pane'];

    if (currentTabIndex < tabIds.length - 1) {
      const currentTab = document.getElementById(tabIds[currentTabIndex]);
      const nextTab = document.getElementById(tabIds[currentTabIndex + 1]);

      const currentPane = document.getElementById(paneIds[currentTabIndex]);
      const nextPane = document.getElementById(paneIds[currentTabIndex + 1]);

      if (currentTab && nextTab && currentPane && nextPane) {
        currentTab.classList.remove('active');
        currentPane.classList.remove('show', 'active');

        nextTab.classList.add('active');
        nextPane.classList.add('show', 'active');
      }
    }
  }
}