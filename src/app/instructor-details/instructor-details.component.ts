// src/app/components/instructor-detail/instructor-detail.component.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IInstructor } from '../../models/instructor';

@Component({
  selector: 'app-instructor-detail',
  templateUrl: './instructor-detail.component.html',
  styleUrls: ['./instructor-detail.component.scss']
})
export class InstructorDetailsComponent implements OnInit {

  instructor?: IInstructor;

  @Input() instructorId: string | null = null;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    if (this.instructorId) {
      this.getInstructorDetails(this.instructorId);
    }
  }

  getInstructorDetails(instructorId: string) {
    this.firestore.collection('instructors').doc(instructorId).valueChanges().subscribe(instructor => {
      console.log("instructor:", instructor);
      this.instructor = instructor as IInstructor;
    });
  }
}
