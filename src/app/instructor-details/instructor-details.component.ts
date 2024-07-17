// src/app/components/instructor-detail/instructor-detail.component.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IInstructor } from '../modules/instructors';
import { ICourse } from '../modules/course'; 
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-instructor-details',
  standalone: true,
  imports: [],
  templateUrl: './instructor-details.component.html',
  styleUrls: ['./instructor-details.component.scss']
})
export class InstructorDetailsComponent implements OnInit {

  instructor?: IInstructor;
  courses: ICourse[] = [];

  @Input() instructorId: string | null = null;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    console.log('ngOnInit - instructorId:', this.instructorId);
    if (this.instructorId) {
      this.getInstructorDetails(this.instructorId);
    } else {
      console.error('Instructor ID is not provided');
    }
  }

  getInstructorDetails(instructorId: string): void {
    console.log('getInstructorDetails - Fetching details for:', instructorId);
    this.firestore.collection('instructor').doc(instructorId).valueChanges()
      .pipe(
        catchError(error => {
          console.error('Error fetching instructor details:', error);
          return of(null);
        }),
        map(data => {
          console.log('Fetched instructor data:', data);
          return data as IInstructor | null;
        }),
        switchMap(instructor => {
          if (instructor) {
            this.instructor = instructor;
            console.log('Instructor found:', instructor);
            return this.firestore.collection(`instructor/${instructorId}/Courses`).valueChanges()
              .pipe(
                catchError(error => {
                  console.error('Error fetching courses:', error);
                  return of([]);
                }),
                map(courses => {
                  console.log('Fetched courses data:', courses);
                  return courses as ICourse[];
                })
              );
          } else {
            console.error('No instructor found with ID:', instructorId);
            return of([]);
          }
        })
      )
      .subscribe(courses => {
        this.courses = courses;
        if (this.instructor) {
          this.instructor.Courses = courses; // Ensure Courses are set in the instructor object
        }
        console.log('Courses:', courses);
      });
  }
}
