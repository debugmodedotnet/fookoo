import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IInstructor } from '../modules/instructors';
import { CommonModule, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-instructor-listing',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './instructor-listing.component.html',
  styleUrl: './instructor-listing.component.scss'
})
export class InstructorListingComponent implements OnInit {

  instructors$!: Observable<IInstructor[]>;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.instructors$ = this.firestore.collection<IInstructor>('instructor').valueChanges();
  }
}