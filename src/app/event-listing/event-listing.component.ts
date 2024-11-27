import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router, RouterModule } from '@angular/router';
import { IEvent } from '../modules/event';
import { map } from 'rxjs';
import { IUser } from '../modules/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-event-listing',
  standalone: true,
  imports: [DatePipe, RouterModule, SlicePipe],
  templateUrl: './event-listing.component.html',
  styleUrl: './event-listing.component.scss'
})
export class EventListingComponent implements OnInit {

  events: IEvent[] = [];
  user?: IUser;
  defaultImage = 'assets/images/events/event_default.svg';
  showLoadMoreButton = false;
  displayedEventsCount = 9;

  private firestore = inject(AngularFirestore);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit() {
    this.getEvents();

    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  getEvents() {
    this.firestore.collection('events').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IEvent;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(events => {
      this.events = events as IEvent[];
      //this.showLoadMoreButton = this.events.length > 8;
      this.updateLoadMoreButton();
    });
  }

  loadMore() {
    this.displayedEventsCount += 10;
    this.updateLoadMoreButton();
  }

  updateLoadMoreButton() {
    this.showLoadMoreButton = this.events.length > this.displayedEventsCount;
  }

  closeModal() {
    const modalElement = document.getElementById('eventModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.removeAttribute('aria-modal');
      modalElement.removeAttribute('role');

      const closeButton = modalElement.querySelector('.btn-close');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode?.removeChild(backdrop);
      }

      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  redirectToLogin() {
    this.closeModal();
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/create-event' } });
  }

  createEvent() {
    if (this.user) {
      this.router.navigate(['/create-event']);
    }
  }

}
