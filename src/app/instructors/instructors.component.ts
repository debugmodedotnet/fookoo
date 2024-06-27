import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IInstructor } from '../modules/instructors';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [NgFor, DatePipe],
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.scss'
})
export class InstructorsComponent implements OnInit {

  instructors: IInstructor[] = [];
  private firestore = inject(AngularFirestore);

  constructor() { }

  ngOnInit(): void {
    this.getInstructors();
  }

  getInstructors() {
    this.firestore.collection('instructor').valueChanges().subscribe(instructors => {
      console.log(instructors);
      this.instructors = instructors as IInstructor[];

    });
  }

 }

 export interface IInstructor {
  id: string;
  Name: string;
  Position: string;
  Bio: string;
  Image: string;
  Email: string;
  Github: string;
  LinkedIn: string;
  Skills: string[];
}
