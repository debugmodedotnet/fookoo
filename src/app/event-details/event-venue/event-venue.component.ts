import { Component, Input, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../services/user.service';
import { IEvent } from '../../modules/event';
import { IUser } from '../../modules/user';

@Component({
  selector: 'app-event-venue',
  standalone: true,
  imports: [],
  templateUrl: './event-venue.component.html',
  styleUrl: './event-venue.component.scss'
})
export class EventVenueComponent implements OnInit {

  //eventVenue?: IEventVenue;
  //eventEnroll?: IEventEnroll;

  defaultImage = 'assets/images/events/default-venue.jpg';

  event?: IEvent;

  enrolled = false;
  isLoading = false;

  @Input() eventId: string | null = null;

  private userService = inject(UserService);
  private router = inject(Router);
  private firestore = inject(AngularFirestore);

  safeUrl?: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.eventId) {
      this.getEventVenue(this.eventId);
    }
  }

  getEventVenue(eventId: string) {
    this.firestore.collection('events').doc(eventId).valueChanges().subscribe(event => {
      console.log("event:", event);
      this.event = event as IEvent;
      this.checkEnrollment();

      if (this.event?.VenueIframe) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.event.VenueIframe);
      }
    });
  }

  attendEvent(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        if (this.enrolled) {
          console.log("User is already enrolled");
          return;
        }
        this.enrollUser(user);
      } else {
        console.log("No user is logged in");
        this.router.navigate(['/login']);
      }
    });
  }

  checkEnrollment() {
    this.userService.getCurrentUser().subscribe(user => {
      if (user && this.eventId) {
        const userRef = this.firestore.collection('event-transactions').doc(this.eventId).collection('users').doc(user.uid);
        userRef.get().subscribe(doc => {
          this.enrolled = doc.exists;
        });
      }
    });
  }

  enrollUser(user: IUser) {
    if (!this.eventId) {
      console.error('No event ID provided');
      return;
    }

    this.isLoading = true;
    const userData = {
      name: user.name || '',
      image: user.photoURL || '',
      email: user.email || ''
    };

    const eventRef = this.firestore.collection('event-transactions').doc(this.eventId);
    const userRef = eventRef.collection('users').doc(user.uid);

    userRef.set(userData).then(() => {
      this.enrolled = true;
      this.isLoading = false;
      console.log("User enrolled successfully");
    }).catch(error => {
      this.isLoading = false;
      console.error('Error enrolling user:', error);
    });
  }

}
