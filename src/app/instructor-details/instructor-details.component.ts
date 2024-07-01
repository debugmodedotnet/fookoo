import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

interface Instructor {
  Name: string;
  Bio: string;
  Email: string;
  InstructorImg: string;
  Position: string;
  skill1: string;
  skill2: string;
  skill3: string;
  skill4: string;
  LinkedIn: string;
  Twitter: string;
  github: string;
}

@Component({
  selector: 'app-instructor-details',
  templateUrl: './instructor-details.component.html',
  styleUrls: ['./instructor-details.component.scss']
})
export class InstructorDetailsComponent implements OnInit {
  instructor: Instructor | undefined;
  skills: string[] = [];

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) { }

  ngOnInit(): void {
    const instructorId = this.route.snapshot.paramMap.get('id');

    if (instructorId) {
      this.db.object<Instructor>(`instructors/${instructorId}`).valueChanges().subscribe(data => {
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
