import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgClass, NgStyle, SlicePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IInstructor } from '../modules/instructors';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [DatePipe, RouterModule, SlicePipe, NgClass, NgStyle],
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.scss'
})
export class InstructorsComponent implements OnInit {

  instructors: IInstructor[] = [];
  private firestore = inject(AngularFirestore);

  defaultImage = 'assets/images/home/defaultInstructor.jpg';

  ngOnInit(): void {
    this.getInstructors();
  }

  getInstructors() {
    this.firestore.collection('instructor', ref => ref.limit(4)).snapshotChanges().pipe(
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

  getColorClass(index: number): string {
    const colorClasses = [
      'purple-bg-gradient',
      'orange-bg-gradient',
      'green-bg-gradient',
      'red-bg-gradient'
    ];
    return colorClasses[index % colorClasses.length];
  }

}
