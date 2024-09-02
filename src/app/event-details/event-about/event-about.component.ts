import { Component, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IEvent } from '../../modules/event';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IUser } from '../../modules/user';

@Component({
  selector: 'app-event-about',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-about.component.html',
  styleUrl: './event-about.component.scss'
})
export class EventAboutComponent implements OnInit {

  eventAbout?: IEvent;
  enrolled = false;
  isLoading = false;

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
    if (eventId) {
      this.firestore.collection('events').doc(eventId).valueChanges().subscribe(eventAbout => {
        console.log("eventAbout:", eventAbout);
        this.eventAbout = eventAbout as IEvent;
        this.checkEnrollment();
      });
    }
  }

  attendEvent(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        if (this.enrolled) {
          //console.log("User is already enrolled");
          return;
        }
        this.enrollUser(user);
      } else {
        //console.log("No user is logged in");
        // this.router.navigate(['/login']);
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
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
