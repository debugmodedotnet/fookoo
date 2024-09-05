import { Injectable, inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { documentId } from "firebase/firestore";
import { IQuizQuestion } from '../modules/quiz-question';
import { Observable, map } from 'rxjs';
import { IQuizAttemptedQuestion } from '../modules/quiz-attempted-question';
import { getRandomInt } from '../utils/common-util';
import { IQuizTechnology } from '../modules/quiz-technology';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private readonly maxOrderValue = 10;
  private readonly quizAttemptCollection = 'quiz-attempt';

  private firestore = inject(AngularFirestore);

  getQuestion(technologyName: string, questionIdsToExclude: string[], orderValue: number = getRandomInt(1, this.maxOrderValue)): Observable<IQuizQuestion[]> {
    let collection: AngularFirestoreCollection<IQuizQuestion>;
    if (questionIdsToExclude.length) {
      collection = this.firestore.collection<IQuizQuestion>(`quiz/${technologyName}/questions`, ref => ref
        .where(documentId(), 'not-in', questionIdsToExclude)
        .where('order', '>=', orderValue)
        .orderBy('order')
        .limit(1)
      );
    } else {
      collection = this.firestore.collection<IQuizQuestion>(`quiz/${technologyName}/questions`, ref => ref
        .where('order', '>=', orderValue)
        .orderBy('order')
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

  getTechnology(name: string): Observable<IQuizTechnology> {
    return this.firestore.collection<IQuizTechnology>('quiz', ref => ref.where('Name', '==', name)).snapshotChanges()
      .pipe(
        map(changes => {
          const doc = changes[0]?.payload.doc;
          const data = doc?.data() as IQuizTechnology;
          const id = doc?.id;
          return { ...data, id };
        })
      );
  }

  async addAttempt(attemptedQuestion: IQuizAttemptedQuestion): Promise<void> {
    await this.firestore.collection(this.quizAttemptCollection).doc(attemptedQuestion.userId).collection(attemptedQuestion.userId).add(attemptedQuestion);
  }

  getAttemptedQuestions(userId: string): Observable<IQuizAttemptedQuestion[]> {
    return this.firestore.collection<IQuizAttemptedQuestion>(this.quizAttemptCollection + '/' + userId + '/' + userId, ref => ref
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
