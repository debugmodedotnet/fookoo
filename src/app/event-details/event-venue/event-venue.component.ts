import { Component, Input, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../services/user.service';
import { IEventVenue } from '../../modules/event-venue';
import { IEventEnroll } from '../../modules/event-enroll';
import { IEvent } from '../../modules/event';

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

  event?: IEvent;

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

      if (this.event?.VenueIframe) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.event.VenueIframe);
      }
    });
  }

  attendEvent(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        console.log("User is logged in", user);
      } else {
        console.log("No user is logged in");
        this.router.navigate(['/login']);
      }
    });
  }

}
