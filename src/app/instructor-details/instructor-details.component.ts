import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

interface Instructor {
  Name: string;
  Bio: string;
  Email: string;
  InstructorImg: string;
  Position: string;
  'Skill-1': string;
  'Skill-2': string;
  'Skill-3': string;
  'Skill-4': string;
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

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) {}

  ngOnInit(): void {
    const instructorId = this.route.snapshot.paramMap.get('id');
    if (instructorId) {
      this.db.object<Instructor>(`instructors/${instructorId}`).valueChanges().subscribe(data => {
        if (data) {
          this.instructor = data;
          this.skills = [
            data['Skill-1'], 
            data['Skill-2'], 
            data['Skill-3'], 
            data['Skill-4']
          ].filter(skill => skill);
        }
      });
    }
  }
}
