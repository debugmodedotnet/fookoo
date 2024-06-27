import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { IInstructor } from '../modules/instructors';

@Component({
  selector: 'app-instructor-details',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule],
  templateUrl: './instructor-details.component.html',
  styleUrl: './instructor-details.component.scss'
})
export class InstructorDetailsComponent implements OnInit {

  instructor?: IInstructor;

  private firestore = inject(AngularFirestore);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const instructorId = params.get('id');
      if (instructorId) {
        this.getInstructorDetails(instructorId);
      }
    });
  }

  getInstructorDetails(id: string) {
    this.firestore.collection('instructor').doc(id).valueChanges().subscribe(instructor => {
      console.log("Instructor details:", instructor);
      this.instructor = instructor as IInstructor;
    });
  }

}
