import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEventSpeakers } from '../../modules/event-speakers';
import { finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-add-speakers',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './add-speakers.component.html',
  styleUrl: './add-speakers.component.scss'
})
export class AddSpeakersComponent implements OnChanges {

  speakers: IEventSpeakers[] = [];
  speakerForm!: FormGroup;
  formVisible = false;
  isEditMode = false;
  editingSpeakerId?: string;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  @Input() eventId!: string;
  @Output() next = new EventEmitter<string>();

  private storage = inject(AngularFireStorage);
  private fb = inject(FormBuilder);
  private firestore = inject(AngularFirestore);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventId'] && this.eventId) {      
      this.initForm();
      this.loadSpeakers();
    }
  }

  initForm(): void {
    this.speakerForm = this.fb.group({
      Name: ['', Validators.required],
      Image: [''],
      Position: ['', Validators.required],
      Info: ['', Validators.required],
      Github: ['', [Validators.pattern('https://github.com/.*')]],
      LinkedIn: ['', [Validators.required, Validators.pattern('https://www.linkedin.com/.*')]],
      X: ['', [Validators.pattern('https://x.com/.*')]]
    });
  }

  loadSpeakers(): void {
    this.firestore.collection(`events/${this.eventId}/speakers`).valueChanges({ idField: 'id' })
      .subscribe((data: any[]) => {
        this.speakers = data.map((item: any) => ({
          id: item.id,
          Name: item.Name,
          Image: item.Image,
          Position: item.Position,
          Info: item.Info,
          Github: item.Github,
          LinkedIn: item.LinkedIn,
          X: item.X
        } as IEventSpeakers));
      });
  }

  showForm(speaker?: IEventSpeakers): void {
    if (speaker) {
      this.isEditMode = true;
      this.editingSpeakerId = speaker.id;
      this.speakerForm.patchValue(speaker);
    } else {
      this.isEditMode = false;
      if (this.speakerForm) {
        this.speakerForm.reset();
      }
    }
    this.formVisible = true;
  }

  hideForm(): void {
    this.formVisible = false;
  }

  addOrUpdateSpeaker(): void {
    if (this.speakerForm.invalid) {
      return;
    }
    const speakerData = this.speakerForm.value;
    if (this.isEditMode && this.editingSpeakerId) {
      this.firestore.doc(`events/${this.eventId}/speakers/${this.editingSpeakerId}`).update(speakerData)
        .then(() => {
          this.loadSpeakers();
          this.hideForm();
        });
    } else {
      this.firestore.collection(`events/${this.eventId}/speakers`).add(speakerData)
        .then(() => {
          this.loadSpeakers();
          this.hideForm();
        });
    }
  }

  uploadImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const filePath = `speakerImages/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: string) => {
            this.imagePreviewUrl = url;
            this.speakerForm.patchValue({ Image: this.imagePreviewUrl });
          });
        })
      ).subscribe();

      // For displaying a preview before upload
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteSpeaker(speakerId?: string): void {
    if (speakerId) {
      this.firestore.doc(`events/${this.eventId}/speakers/${speakerId}`).delete().then(() => {
        this.loadSpeakers();
      });
    }
  }

  editSpeaker(speaker: IEventSpeakers): void {
    this.showForm(speaker);
  }

  navigateToAddAgenda(): void {
    if (this.eventId) {
      this.next.emit(this.eventId);
    }
  }
}