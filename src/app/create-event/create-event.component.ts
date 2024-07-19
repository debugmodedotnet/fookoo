import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../services/event.service';
import { IEvent } from '../modules/event';

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

  get agendaFormArray(): FormArray {
    return this.eventForm.get('Agenda') as FormArray;
  }

  get speakersFormArray(): FormArray {
    return this.eventForm.get('Speakers') as FormArray;
  }

  ngOnInit(): void {
    this.loadEvents();
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

    const event = this.eventForm.value as IEvent;

    if (this.editMode && this.currentEventId) {
      this.updateEvent(this.currentEventId, event);
    } else {
      this.addEvent(eventId, event);
    }
  }

  addEvent(id: string, event: IEvent) {
    this.eventService.addEvent(event, id).then(() => {
      this.resetForm();
      this.loadEvents();
    }).catch(error => {
      console.error('Error adding event:', error);
    });
  }

  updateEvent(id: string, event: IEvent) {
    this.eventService.updateEvent(id, event).then(() => {
      this.resetForm();
      this.loadEvents();
    }).catch(error => {
      console.error('Error updating event:', error);
    });
  }

  // editEvent(event: IEvent) {
  //   this.eventForm.patchValue(event);

  //   const speakersFormArray = this.eventForm.get('Speakers') as FormArray;
  //   const agendaFormArray = this.eventForm.get('Agenda') as FormArray;
  //   speakersFormArray.clear();
  //   agendaFormArray.clear();

  //   if (event.Speakers) {
  //     event.Speakers.forEach(speaker => {
  //       speakersFormArray.push(new FormGroup({
  //         id: new FormControl(speaker.id),
  //         Name: new FormControl(speaker.Name),
  //         Image: new FormControl(speaker.Image),
  //         Position: new FormControl(speaker.Position),
  //         Info: new FormControl(speaker.Info),
  //         Github: new FormControl(speaker.Github),
  //         LinkedIn: new FormControl(speaker.LinkedIn),
  //         X: new FormControl(speaker.X),
  //       }));
  //     });
  //   }

  //    if (event.Agenda) {
  //     event.Agenda.forEach(agenda => {
  //       agendaFormArray.push(new FormGroup({
  //         id: new FormControl(agenda.id),
  //         Info: new FormControl(agenda.Info),
  //         Speaker: new FormControl(agenda.Speaker),
  //         Tech: new FormControl(agenda.Tech),
  //         Time: new FormControl(agenda.Time),
  //         Title: new FormControl(agenda.Title),
  //         SpeakerImg: new FormControl(agenda.SpeakerImg),
  //       }));
  //     });
  //   }

  //   this.editMode = true;
  //   this.currentEventId = event.Id;
  //   this.formVisible = true;
  // }

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
      displayAtHomePage: false
    });
    this.editMode = false;
    this.currentEventId = undefined;
    this.formVisible = false;
  }

  showForm() {
    this.formVisible = true;
  }

  hideForm() {
    this.formVisible = false;
    this.resetForm();
  }

}
