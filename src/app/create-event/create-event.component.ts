import { Component, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../services/event.service';
import { IEvent } from '../modules/event';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
})
export class CreateEventComponent {

  events: IEvent[] = [];
  eventForm: FormGroup;
  totalEventCount = 0;

  editMode = false;
  currentEventId?: string;
  formVisible = false;

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
      VenueIframe:new FormControl('', Validators.required),
      isOffline: new FormControl(false),
      isPaid: new FormControl(false),
      isCertificateProvided: new FormControl(false),
      displayAtHomePage: new FormControl(false),
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

  addOrUpdateEvent() {
    console.log(this.totalEventCount);
    let eid = "e" + this.totalEventCount + 1;
    this.eventForm?.get('Id')?.setValue(eid);

    if (this.editMode && this.currentEventId) {
      this.updateEvent(this.currentEventId, this.eventForm.value);
    } else {
      this.addEvent();
    }
  }

  addEvent() {
    this.eventService.addEvent(this.eventForm.value).then(() => {
      this.resetForm();
      this.loadEvents();
    }).catch(error => {
      console.error('Error adding video:', error);
    });
  }

  updateEvent(id: string, event: IEvent) {
    this.eventService.updateEvent(id, event).then(() => {
      this.resetForm();
      this.loadEvents();
    }).catch(error => {
      console.error('Error updating video:', error);
    });
  }

  editEvent(event: IEvent) {
    this.eventForm.patchValue(event);
    this.editMode = true;
    this.currentEventId = event.Id;
    this.formVisible = true;
  }

  resetForm() {
    this.eventForm.reset({
      Title: '',
      TotalSeats: '',
      RegisteredSeats: '',
      Tech: '',
      Logo: '',
      Tagline:'',
      ShortDescription: '',
      Description: '',
      Date: '',
      City: '',
      EventImage:'',
      VenueName: '',
      VenueInfo: '',
      VenueImg: '',
      VenueIframe:'',
      isOffline: false,
      isPaid: false,
      isCertificateProvided: false,
      displayAtHomePage: false
    });
    this.editMode = false;
    this.currentEventId = undefined;
    this.formVisible = false;
  }

}
