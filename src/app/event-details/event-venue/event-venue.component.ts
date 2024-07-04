import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../services/user.service';
import { IEventVenue } from '../../modules/event-venue';
import { IEventEnroll } from '../../modules/event-enroll';

@Component({
  selector: 'app-event-venue',
  standalone: true,
  imports: [],
  templateUrl: './event-venue.component.html',
  styleUrl: './event-venue.component.scss'
})
export class EventVenueComponent implements OnInit {

  eventVenue?: IEventVenue;
  eventEnroll?: IEventEnroll;

  private userService = inject(UserService);
  private router = inject(Router);
  private firestore = inject(AngularFirestore);

  safeUrl?: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getEventVenue();
  }

  getEventVenue() {
    this.firestore.collection('event-details').doc('event-venue').valueChanges().subscribe(eventVenue => {
      console.log("eventVenue:", eventVenue);
      this.eventVenue = eventVenue as IEventVenue;
      if (this.eventVenue?.VenueMap) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.eventVenue.VenueMap);
      }
    });

    this.firestore.collection('event-details').doc('enroll-now').valueChanges().subscribe(eventEnroll => {
      console.log("eventEnroll:", eventEnroll);
      this.eventEnroll = eventEnroll as IEventEnroll;
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
