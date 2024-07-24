import { Component, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEvent } from '../../modules/event';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-about',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-about.component.html',
  styleUrl: './event-about.component.scss'
})
export class EventAboutComponent implements OnInit {

  eventAbout?: IEvent;

  @Input() eventId: string | null = null;

  private firestore = inject(AngularFirestore);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.eventId) {
      this.getEventDetails(this.eventId);
    }
  }

  getEventDetails(eventId: string) {
    this.firestore.collection('events').doc(eventId).valueChanges().subscribe(eventAbout => {
      console.log("eventAbout:", eventAbout);
      this.eventAbout = eventAbout as IEvent;
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
