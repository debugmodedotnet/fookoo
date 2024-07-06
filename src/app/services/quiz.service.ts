import { Injectable, inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentData, Query } from '@angular/fire/compat/firestore';
import { query, orderBy, limit, getDocs, collection, QuerySnapshot, documentId } from "firebase/firestore";
import { IQuizQuestion } from '../modules/quiz-question';
import { Observable, map } from 'rxjs';
import { IQuizAttemptedQuestion } from '../modules/quiz-attempted-question';
// import * as firebase from 'firebase/app';
// import firebase from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private readonly quizCollection = 'quiz';
  private readonly quizAttemptCollection = 'quiz-attempt';

  private firestore = inject(AngularFirestore);

  getQuestion(questionIdsToExclude: string[]): Observable<IQuizQuestion[]> {
    let collection: AngularFirestoreCollection<IQuizQuestion>;
    if (questionIdsToExclude.length) {
      collection = this.firestore.collection<IQuizQuestion>(this.quizCollection, ref => ref
        .where(documentId(), 'not-in', questionIdsToExclude)
        .limit(1)
      );
    } else {
      collection = this.firestore.collection<IQuizQuestion>(this.quizCollection, ref => ref
        .limit(1)
      );
    }
    return collection.snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(a => {
            const data = a.payload.doc.data() as IQuizQuestion;
            const id = a.payload.doc.id;
            return { ...data, id };
          })
        )
      );
  }

  async addAttempt(attemptedQuestion: IQuizAttemptedQuestion): Promise<void> {
    await this.firestore.collection(this.quizAttemptCollection).add(attemptedQuestion);
  }

  getAttemptedQuestions(userId: string): Observable<IQuizAttemptedQuestion[]> {
    return this.firestore.collection<IQuizAttemptedQuestion>(this.quizAttemptCollection, ref => ref
      .where('userId', '==', userId)
    ).snapshotChanges().pipe(
      map(changes =>
        changes.map(a => {
          const data = a.payload.doc.data() as IQuizAttemptedQuestion;
          const id = a.payload.doc.id;
          return { ...data, id };
        })
      )
    );
  }
}
