import { Component, inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IInstructor } from '../modules/instructors';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-instructor-listing',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './instructor-listing.component.html',
  styleUrl: './instructor-listing.component.scss'
})
export class InstructorListingComponent implements OnInit {

  defaultImage = 'assets/images/home/instructor-default.jpg';

  instructors$!: Observable<IInstructor[]>;
  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.instructors$ = this.firestore.collection<IInstructor>('instructor').valueChanges();
  }
}