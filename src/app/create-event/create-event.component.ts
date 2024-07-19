import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../services/event.service';
import { IEvent } from '../modules/event';
import { IEventSpeakers } from '../modules/event-speakers';
import { IEventAgenda } from '../modules/event-agenda';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
})
export class CreateEventComponent implements OnInit {

  events: IEvent[] = [];
  eventForm: FormGroup;
  totalEventCount = 0;
  editMode = false;
  currentEventId?: string;
  formVisible = false;

  private eventService = inject(EventService);

  constructor() {
    this.eventForm = new FormGroup({
      Id: new FormControl(''),
      Title: new FormControl('', Validators.required),
      TotalSeats: new FormControl('', Validators.required),
      RegisteredSeats: new FormControl('', Validators.required),
      Tech: new FormControl('', Validators.required),
      Logo: new FormControl('', Validators.required),
      Tagline: new FormControl('', Validators.required),
      ShortDescription: new FormControl('', Validators.maxLength(200)),
      Description: new FormControl('', Validators.required),
      Date: new FormControl('', Validators.required),
      City: new FormControl('', Validators.required),
      EventImage: new FormControl('', Validators.required),
      VenueName: new FormControl('', Validators.required),
      VenueInfo: new FormControl('', Validators.required),
      VenueImg: new FormControl('', Validators.required),
      VenueIframe: new FormControl('', Validators.required),
      isOffline: new FormControl(false),
      isPaid: new FormControl(false),
      isCertificateProvided: new FormControl(false),
      displayAtHomePage: new FormControl(false),
      Speakers: new FormArray([]),
      Agenda: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  get agendaFormArray(): FormArray {
    return this.eventForm.get('Agenda') as FormArray;
  }

  get speakersFormArray(): FormArray {
    return this.eventForm.get('Speakers') as FormArray;
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(
      events => {
        this.events = events;
        this.totalEventCount = events.length;
      },
      error => {
        console.error('Error loading events:', error);
      }
    );
  }

  generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true });
  }

  addOrUpdateEvent() {
    const title = this.eventForm.get('Title')?.value;
    const slug = this.generateSlug(title);
    const uuid = uuidv4();
    const eventId = `${slug}-${uuid}`;

    this.eventForm.get('Id')?.setValue(eventId);

    const speakers = this.speakersFormArray.value as IEventSpeakers[];
    const agenda = this.agendaFormArray.value as IEventAgenda[];
    const event = { ...this.eventForm.value } as IEvent;

    delete event.Speakers;
    delete event.Agenda;

    if (this.editMode && this.currentEventId) {
      this.updateEvent(this.currentEventId, event, speakers, agenda);
    } else {
      this.addEvent(eventId, event, speakers, agenda);
    }
  }

  addEvent(id: string, event: IEvent, speakers: IEventSpeakers[], agenda: IEventAgenda[]) {
    this.eventService.addEvent(event, id).then(() => {
      this.addSpeakers(id, speakers);
      this.addAgendas(id, agenda);
      this.resetForm();
      this.loadEvents();
    }).catch(error => {
      console.error('Error adding event:', error);
    });
  }

  updateEvent(id: string, event: IEvent, speakers: IEventSpeakers[], agenda: IEventAgenda[]) {
    this.eventService.updateEvent(id, event).then(() => {
      this.updateSpeakers(id, speakers);
      this.updateAgenda(id, agenda);
      this.resetForm();
      this.loadEvents();
    }).catch(error => {
      console.error('Error updating event:', error);
    });
  }

  addSpeakers(eventId: string, speakers: IEventSpeakers[]) {
    speakers.forEach(speaker => {
      this.eventService.addSpeaker(eventId, speaker).catch(error => {
        console.error('Error adding speaker:', error);
      });
    });
  }

  updateSpeakers(eventId: string, speakers: IEventSpeakers[]) {
    speakers.forEach(speaker => {
      if (speaker.id) {
        this.eventService.updateSpeaker(eventId, speaker.id, speaker).catch(error => {
          console.error('Error updating speaker:', error);
        });
      } else {
        this.eventService.addSpeaker(eventId, speaker).catch(error => {
          console.error('Error adding speaker:', error);
        });
      }
    });
  }

  addAgendas(eventId: string, agenda: IEventAgenda[]) {
    agenda.forEach(agendaItem => {
      this.eventService.addAgenda(eventId, agendaItem).catch(error => {
        console.error('Error adding agenda item:', error);
      });
    });
  }

  updateAgenda(eventId: string, agenda: IEventAgenda[]) {
    agenda.forEach(agendaItem => {
      if (agendaItem.id) {
        this.eventService.updateAgenda(eventId, agendaItem.id, agendaItem).catch(error => {
          console.error('Error updating agenda item:', error);
        });
      } else {
        this.eventService.addAgenda(eventId, agendaItem).catch(error => {
          console.error('Error adding agenda item:', error);
        });
      }
    });
  }

  editEvent(event: IEvent) {
    this.eventForm.patchValue(event);

    const speakersFormArray = this.eventForm.get('Speakers') as FormArray;
    const agendaFormArray = this.eventForm.get('Agenda') as FormArray;

    speakersFormArray.clear();
    agendaFormArray.clear();

    if (event.Speakers) {
      event.Speakers.forEach(speaker => {
        speakersFormArray.push(new FormGroup({
          id: new FormControl(speaker.id),
          Name: new FormControl(speaker.Name),
          Image: new FormControl(speaker.Image),
          Position: new FormControl(speaker.Position),
          Info: new FormControl(speaker.Info),
          Github: new FormControl(speaker.Github),
          LinkedIn: new FormControl(speaker.LinkedIn),
          X: new FormControl(speaker.X),
        }));
      });
    }

    if (event.Agenda) {
      event.Agenda.forEach(agendaItem => {
        agendaFormArray.push(new FormGroup({
          id: new FormControl(agendaItem.id),
          Info: new FormControl(agendaItem.Info),
          Speaker: new FormControl(agendaItem.Speaker),
          Tech: new FormControl(agendaItem.Tech),
          Time: new FormControl(agendaItem.Time),
          Title: new FormControl(agendaItem.Title),
          SpeakerImg: new FormControl(agendaItem.SpeakerImg),
        }));
      });
    }

    this.editMode = true;
    this.currentEventId = event.Id;
    this.showForm();
  }

  deleteEvent(id: string | undefined) {
    if (id) {
      this.eventService.deleteEvent(id).then(() => {
        this.loadEvents();
      }).catch(error => {
        console.error('Error deleting event:', error);
      });
    } else {
      console.error('Event ID is undefined, cannot delete.');
    }
  }

  resetForm() {
    this.eventForm.reset({
      Title: '',
      TotalSeats: '',
      RegisteredSeats: '',
      Tech: '',
      Logo: '',
      Tagline: '',
      ShortDescription: '',
      Description: '',
      Date: '',
      City: '',
      EventImage: '',
      VenueName: '',
      VenueInfo: '',
      VenueImg: '',
      VenueIframe: '',
      isOffline: false,
      isPaid: false,
      isCertificateProvided: false,
      displayAtHomePage: false,
      Speakers: [],
      Agenda: [],
    });
    this.speakersFormArray.clear();
    this.agendaFormArray.clear();
    this.editMode = false;
    this.currentEventId = undefined;
    this.hideForm();
  }

  showForm() {
    this.formVisible = true;
  }

  hideForm() {
    this.formVisible = false;
    this.resetForm();
  }

  addSpeaker() {
    this.speakersFormArray.push(new FormGroup({
      id: new FormControl(''),
      Name: new FormControl('', Validators.required),
      Image: new FormControl('', Validators.required),
      Position: new FormControl('', Validators.required),
      Info: new FormControl('', Validators.required),
      Github: new FormControl(''),
      LinkedIn: new FormControl(''),
      X: new FormControl(''),
    }));
  }

  removeSpeaker(index: number) {
    this.speakersFormArray.removeAt(index);
  }

  addAgenda() {
    this.agendaFormArray.push(new FormGroup({
      id: new FormControl(''),
      Info: new FormControl('', Validators.required),
      Speaker: new FormControl('', Validators.required),
      Tech: new FormControl('', Validators.required),
      Time: new FormControl('', Validators.required),
      Title: new FormControl('', Validators.required),
      SpeakerImg: new FormControl('', Validators.required),
    }));
  }

  removeAgenda(index: number) {
    this.agendaFormArray.removeAt(index);
  }

}