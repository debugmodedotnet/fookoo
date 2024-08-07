import { Component, inject, OnInit } from '@angular/core';
import { IQuizTechnology } from '../modules/quiz-technology';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss'
})
export class QuizListComponent implements OnInit {

  techStack?: IQuizTechnology[];

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.firestore.collection('quiz').valueChanges().subscribe(techStack => {
      this.techStack = techStack as IQuizTechnology[];
    });
  }
}


