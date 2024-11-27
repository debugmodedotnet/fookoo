import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { IEvent } from '../../modules/event';
import { EventService } from '../../services/event.service';
import { CreateEventService } from '../../services/create-event.service';

@Component({
  selector: 'app-add-basics',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './add-basics.component.html',
  styleUrl: './add-basics.component.scss'
})
export class AddBasicsComponent implements OnInit {

  events: IEvent[] = [];
  eventForm: FormGroup;
  isProcessing = false;
  photoURL?: string;
  venueImageURL: string | null = null;

  @Output() next = new EventEmitter<string>(); 
  
  private storage = inject(AngularFireStorage);
  private eventService = inject(EventService);
  private createEventService = inject(CreateEventService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.eventForm = this.fb.group({
      Id: [''],
      Title: ['', Validators.required],
      TotalSeats: ['', Validators.required],
      RegisteredSeats: [0],
      Tech: ['Select Technology', Validators.required],
      Logo: [''],
      Description: ['', [Validators.required, Validators.maxLength(500), Validators.minLength(300)]],
      Date: ['', Validators.required],
      City: ['', Validators.required],
      EventImage: [''],
      VenueName: [{ value: '', disabled: true }, Validators.required],
      VenueInfo: [{ value: '', disabled: true }, Validators.required],
      VenueIframe: [{ value: '', disabled: true }, Validators.required],
      isOffline: [false],
      isCertificateProvided: [false],
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

    this.eventForm.get('Tech')?.valueChanges.subscribe(selectedTech => {
      const techLogos: { [key: string]: string } = {
        Angular: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1024px-Angular_full_color_logo.svg.png',
        React: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png',
        Vue: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1024px-Vue.js_Logo_2.svg.png',
        GenAI: 'https://static.wixstatic.com/media/0bad3c_220cea840d984c88a9f4f5db2740d301~mv2.png/v1/fill/w_560,h_190,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/0bad3c_220cea840d984c88a9f4f5db2740d301~mv2.png',
      };

      const logoUrl = techLogos[selectedTech] || '';
      this.eventForm.patchValue({ Logo: logoUrl });
    });
    this.disableVenueFields();
  }

  generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true });
  }

  addEvent() {
    if (this.isProcessing) {
      return;
    }

    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const title = this.eventForm.get('Title')?.value;
    const slug = this.generateSlug(title);
    const uuid = uuidv4();
    const eventId = `${slug}-${uuid}`;

    this.createEventService.setEventId(eventId);  
    this.eventForm.get('Id')?.setValue(eventId);

    const event = { ...this.eventForm.value } as IEvent;
    this.isProcessing = true;

    this.eventService.addEvent(event, eventId).then(() => {
      this.resetForm();
      this.next.emit(eventId); 
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
      Tech: '',
      Logo: '',
      Description: '',
      Date: '',
      City: '',
      EventImage: '',
      VenueName: '',
      VenueInfo: '',
      VenueIframe: '',
      isOffline: false,
      isCertificateProvided: false
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