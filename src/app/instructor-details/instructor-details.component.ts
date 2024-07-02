import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { IInstructor } from '../modules/instructors';


@Component({
  selector: 'app-instructor-details',
  templateUrl: './instructor-details.component.html',
  styleUrls: ['./instructor-details.component.scss']
})
export class InstructorDetailsComponent implements OnInit {
  instructor: IInstructor | undefined;
  skills: string[] = [];

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) { }

  ngOnInit(): void {
    const instructorId = this.route.snapshot.paramMap.get('id');

    if (instructorId) {
      this.db.object<IInstructor>(`instructors/${instructorId}`).valueChanges().subscribe(data => {
        if (data) {
          this.instructor = data;
          this.skills = [
            data['skill1'],
            data['skill2'],
            data['skill3'],
            data['skill4']
          ].filter(skill => skill);
        }
      });
    }
  }
}
