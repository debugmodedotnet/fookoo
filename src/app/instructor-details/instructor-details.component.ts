import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { IInstructor } from '../modules/instructors';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-instructor-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor-details.component.html',
  styleUrls: ['./instructor-details.component.scss']
})
export class InstructorDetailsComponent implements OnInit {

  instructor: IInstructor | null = null;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.getInstructorDetails()
  }

  getInstructorDetails() {
    const instructorId = this.route.snapshot.paramMap.get('id');
    console.log('Instructor ID:', instructorId);

    if (instructorId) {
      this.firestore.collection('instructor').doc(instructorId).valueChanges().subscribe({
        next: (data) => {
          if (data) {
            this.instructor = data as IInstructor;
          } else {
            this.instructor = null;
          }
          console.log('Received data:', data);
        },
        error: (err) => {
          console.error('Error fetching instructor details:', err);
        }
      });
    }
  }

}