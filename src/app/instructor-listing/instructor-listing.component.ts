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
  private firestore = inject(AngularFirestore);

  defaultImage = 'assets/images/home/defaultInstructor.jpg';

  ngOnInit(): void {
    this.getInstructors();
  }

  getInstructors() {
    this.firestore.collection('instructor', ref => ref.limit(3)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IInstructor;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(instructors => {
      console.log(instructors);
      this.instructors = instructors as IInstructor[];
    });
  }
  
}