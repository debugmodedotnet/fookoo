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

  defaultImage = 'assets/images/home/instructor-default.jpg';

  instructor?: IInstructor;
  courses: ICourse[] = [];

  @Input() instructorId: string | null = null;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    if (this.instructorId) {
      this.getInstructorDetails(this.instructorId);
    } 
  }

  getInstructorDetails(instructorId: string): void {
    this.firestore.collection('instructor').doc(instructorId).valueChanges()
      .pipe(
        catchError(() => {
          return of(null);
        }),
        map(data => {
          return data as IInstructor | null;
        }),
        switchMap(instructor => {
          if (instructor) {
            this.instructor = instructor;
            return this.firestore.collection(`instructor/${instructorId}/Courses`).valueChanges()
              .pipe(
                catchError(() => {
                  return of([]);
                }),
                map(courses => {
                  return courses as ICourse[];
                })
              );
          } else {            
            return of([]);
          }
        })
      )
      .subscribe(courses => {
        this.courses = courses;
        if (this.instructor) {
          this.instructor.Courses = courses; 
        }        
      });
  }
}
