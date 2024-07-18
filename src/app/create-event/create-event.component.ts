import { Component, inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../services/event.service';
import { IEvent } from '../modules/event';
import slugify from 'slugify';
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

  speakerFormVisible = false;
  currentSpeakerIndex: number | null = null;

  private firestore = inject(AngularFirestore);
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
    this.eventForm?.get('Id')?.setValue(slug);

    if (this.editMode && this.currentEventId) {
      this.updateEvent(this.currentEventId, this.eventForm.value);
    } else {
      this.addEvent(slug);
    }
  }

  addEvent(slug: string) {
    this.eventService.addEvent(this.eventForm.value, slug).then(() => {
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

  editEvent(event: IEvent) {
    this.eventForm.patchValue(event);
    this.editMode = true;
    this.currentEventId = event.Id;
    this.formVisible = true;

    this.setSpeakers(event.Speakers);
    this.setAgenda(event.Agenda);
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
    this.speakerFormVisible = false;
    this.currentSpeakerIndex = null;
  }

  showForm() {
    this.formVisible = true;
  }

  hideForm() {
    this.formVisible = false;
    this.resetForm();
  }

  get Speakers() {
    return this.eventForm.get('Speakers') as FormArray;
  }

  get Agenda() {
    return this.eventForm.get('Agenda') as FormArray;
  }

  showSpeakerForm(index?: number) {
    this.speakerFormVisible = true;
    if (index !== undefined) {
      this.currentSpeakerIndex = index;
    } else {
      this.Speakers.push(new FormGroup({
        Name: new FormControl('', Validators.required),
        Image: new FormControl('', Validators.required),
        Position: new FormControl('', Validators.required),
        Info: new FormControl('', Validators.required),
        Github: new FormControl(''),
        LinkedIn: new FormControl(''),
        X: new FormControl('')
      }));
      this.currentSpeakerIndex = this.Speakers.length - 1;
    }
  }

  saveSpeaker() {
    this.speakerFormVisible = false;
    this.currentSpeakerIndex = null;
  }

  cancelSpeakerForm() {
    if (this.currentSpeakerIndex !== null && this.currentSpeakerIndex >= this.Speakers.length - 1) {
      this.Speakers.removeAt(this.currentSpeakerIndex);
    }
    this.speakerFormVisible = false;
    this.currentSpeakerIndex = null;
  }

  editSpeaker(index: number) {
    this.showSpeakerForm(index);
  }

  addSpeaker() {
    this.Speakers.push(new FormGroup({
      Name: new FormControl('', Validators.required),
      Bio: new FormControl('', Validators.required),
      Image: new FormControl('', Validators.required)
    }));
  }

  addAgendaItem() {
    this.Agenda.push(new FormGroup({
      Time: new FormControl('', Validators.required),
      Activity: new FormControl('', Validators.required)
    }));
  }

  removeSpeaker(index: number) {
    this.Speakers.removeAt(index);
  }

  removeAgendaItem(index: number) {
    this.Agenda.removeAt(index);
  }

  setSpeakers(speakers: IEventSpeakers[]) {
    const speakerFGs = speakers.map(speaker => new FormGroup({
      Name: new FormControl(speaker.Name, Validators.required),
      Image: new FormControl(speaker.Image, Validators.required),
      Position: new FormControl(speaker.Position, Validators.required),
      Info: new FormControl(speaker.Info, Validators.required),
      Github: new FormControl(speaker.Github),
      LinkedIn: new FormControl(speaker.LinkedIn),
      X: new FormControl(speaker.X)
    }));
    const speakerFormArray = new FormArray(speakerFGs);
    this.eventForm.setControl('Speakers', speakerFormArray);
  }

  setAgenda(agenda: IEventAgenda[]) {
    const agendaFGs = agenda.map(item => new FormGroup({
      Info: new FormControl(item.Info),
      Speaker: new FormControl(item.Speaker),
      Tech: new FormControl(item.Tech),
      Time: new FormControl(item.Time, Validators.required),
      Title: new FormControl(item.Title, Validators.required),
      SpeakerImg: new FormControl(item.SpeakerImg)
    }));
    const agendaFormArray = new FormArray(agendaFGs);
    this.eventForm.setControl('Agenda', agendaFormArray);
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length) {
      formArray.removeAt(0);
    }
  }

}
