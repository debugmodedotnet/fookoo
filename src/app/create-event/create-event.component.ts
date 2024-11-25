import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../services/event.service';
import { IEvent } from '../modules/event';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent implements OnInit {

  events: IEvent[] = [];
  eventForm: FormGroup;
  isProcessing = false;
  photoURL?: string;
  venueImageURL: string | null = null;

  private storage = inject(AngularFireStorage);
  private eventService = inject(EventService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.eventForm = this.fb.group({
      Id: [''],
      Title: ['', Validators.required],
      TotalSeats: ['', Validators.required],
      RegisteredSeats: ['', Validators.required],
      Tech: ['', Validators.required],
      Logo: ['', Validators.required],
      Tagline: ['', Validators.required],
      ShortDescription: ['', [Validators.required, Validators.maxLength(145)]],
      Description: ['', [Validators.required, Validators.maxLength(500), Validators.minLength(300)]],
      Date: ['', Validators.required],
      City: ['', Validators.required],
      EventImage: [''],
      VenueName: [{ value: '', disabled: true }, Validators.required],
      VenueInfo: [{ value: '', disabled: true }, Validators.required],
      VenueImg: [{ value: '', disabled: true }, Validators.required],
      VenueIframe: [{ value: '', disabled: true }, Validators.required],
      isOffline: [false],
      isPaid: [false],
      price: [{ value: '', disabled: true }, Validators.required],
      isCertificateProvided: [false],
      displayAtHomePage: [false],
      isActive: [false],
      isPrivate: [false],

    });
  }

  ngOnInit(): void {
    this.eventForm.get('isOffline')?.valueChanges.subscribe(isOffline => {
      if (isOffline) {
        this.enableVenueFields();
      } else {
        this.disableVenueFields();
      }
    });

    this.eventForm.get('isPaid')?.valueChanges.subscribe(isPaid => {
      const priceControl = this.eventForm.get('price');
      if (isPaid) {
        priceControl?.enable();
      } else {
        priceControl?.disable();
        priceControl?.reset();
      }
    });

    this.disableVenueFields();
  }

  generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true });
  }

  addEvent() {
    if (this.isProcessing) {
      //console.warn('Form is currently processing, operation skipped.');
      return;
    }

    if (this.eventForm.invalid) {
      //console.warn('Form is invalid. Please fill in all required fields.');
      this.eventForm.markAllAsTouched();
      return;
    }

    //console.log('Form values on submit:', this.eventForm.value);
    const title = this.eventForm.get('Title')?.value;
    const slug = this.generateSlug(title);
    const uuid = uuidv4();
    const eventId = `${slug}-${uuid}`;

    this.eventForm.get('Id')?.setValue(eventId);

    const event = { ...this.eventForm.value } as IEvent;
    this.isProcessing = true;

    this.eventService.addEvent(event, eventId).then(() => {
      this.resetForm();
      this.router.navigate(['/add-speakers', eventId]);
    }).finally(() => {
      this.isProcessing = false;
    });
  }

  cancel() {
    this.resetForm();
    this.router.navigate(['/events']);
  }

  resetForm() {
    this.eventForm.reset({
      Id: '',
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
      isActive: false,
      isPrivate: false,
      price: ''
    });
  }

  uploadPhoto(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const filePath = `eventPhotos/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: string) => {
            this.photoURL = url;
            this.eventForm.patchValue({ EventImage: this.photoURL });
          });
        })
      ).subscribe();
    }
  }

  uploadVenueImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const filePath = `venuePhotos/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: string) => {
            this.venueImageURL = url;
            this.eventForm.patchValue({ VenueImg: this.venueImageURL });
          });
        })
      ).subscribe();
    }
  }

  enableVenueFields() {
    this.eventForm.get('VenueName')?.enable();
    this.eventForm.get('VenueInfo')?.enable();
    this.eventForm.get('VenueImg')?.enable();
    this.eventForm.get('VenueIframe')?.enable();
  }

  disableVenueFields() {
    this.eventForm.get('VenueName')?.disable();
    this.eventForm.get('VenueInfo')?.disable();
    this.eventForm.get('VenueImg')?.disable();
    this.eventForm.get('VenueIframe')?.disable();
  }

}