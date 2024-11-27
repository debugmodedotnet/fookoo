import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateEventService {

  private eventId = '';

  setEventId(eventId: string): void {
    this.eventId = eventId;
  }

  getEventId(): string {
    return this.eventId;
  }
}
