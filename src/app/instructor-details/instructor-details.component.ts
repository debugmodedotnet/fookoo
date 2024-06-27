import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IInstructor } from '../modules/instructor';

@Component({
  selector: 'app-instructor-details',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './instructor-details.component.html',
  styleUrl: './instructor-details.component.scss'
})
export class InstructorDetailsComponent implements OnInit {

  instructor?: IInstructor;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getInstructorDetails();
  }

  getInstructorDetails() {
    this.firestore.collection('instructor-details').doc('instructor-info').valueChanges().subscribe(instructor => {
      console.log("instructor:", instructor);
      this.instructor = instructor as IInstructor;
    });
  }

}
