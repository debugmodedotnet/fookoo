import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IInstructor } from '../modules/instructors';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-instructor-listing',
  standalone: true,
  imports: [DatePipe, RouterModule],
  templateUrl: './instructor-listing.component.html',
  styleUrl: './instructor-listing.component.scss'
})
export class InstructorListingComponent implements OnInit {

  instructors: IInstructor[] = [];
  defaultImage = 'assets/images/home/defaultInstructor.jpg';
  showLoadMoreButton = false;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getInstructors();
  }

  getInstructors() {
    this.firestore.collection('instructor').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IInstructor;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(instructors => {
      this.instructors = instructors as IInstructor[];
      this.showLoadMoreButton = this.instructors.length > 6;
    });
  }

  loadMore() {
    console.log('Load more clicked');
  }

}