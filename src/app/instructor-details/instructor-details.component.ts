import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IInstructor } from '../modules/instructors';

@Component({
  selector: 'app-instructor-details',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './instructor-details.component.html',
  styleUrls: ['./instructor-details.component.scss']
})
export class InstructorDetailsComponent implements OnInit {
  instructor: IInstructor | null = null;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.getInstructorDetails();
  }

  getInstructorDetails() {
    const instructorId = this.route.snapshot.paramMap.get('id');
    if (instructorId) {
      this.firestore.collection('instructors').doc(instructorId).valueChanges().subscribe({
        next: (data) => {
          if (data) {
            this.instructor = data as IInstructor;
          } else {
            this.instructor = null;
          }
        },
        error: (err) => {
          console.error('Error fetching instructor details:', err);
        }
      });
    }
  }
}
