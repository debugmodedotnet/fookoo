import { Component, OnInit, inject } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IQuizQuestion } from '../modules/quiz-question';
import { first, interval, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { shuffleItems } from '../utils/common-util';
import { ActivatedRoute } from '@angular/router';
import { IQuizTechnology } from '../modules/quiz-technology';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {

  readonly TOTAL_ALLOWED_QUIZ_ATTEMPTS = 3;
  quizForm: FormGroup;
  totalAttemptedQuestions = 0;
  totalQuestions = 0;
  question?: IQuizQuestion;
  userId?: string;
  technologyName = '';
  technology?: IQuizTechnology;
  initializingInfo = true;
  exceededMaxQuizAttempts = true;

  private quizService = inject(QuizService);
  private userService = inject(UserService);
  private afAuth = inject(AngularFireAuth);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  private timerSubscription?: Subscription;
  timeLeft = '00:00:00';
  private readonly TIMER_DURATION = 5 * 60 * 1000;
  private readonly TIMER_INTERVAL = 1000;

  userScore = 0;
  passingScore = 80;
  scorePercentage = 0;

  constructor() {
    this.quizForm = this.fb.group({
      optionId: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.technologyName = params['Name'];
      this.afAuth.user.pipe(first()).subscribe(async res => {
        this.userId = res?.uid;
        this.userService.getCurrentUser().pipe(first()).subscribe(async user => {
          this.initializingInfo = false;
          const quizAttempts = (user?.quizAttempts ?? 0);
          if (quizAttempts < this.TOTAL_ALLOWED_QUIZ_ATTEMPTS) {
            this.exceededMaxQuizAttempts = false;
            await this.loadTechnologyData();
            this.loadNewQuestion();
            await this.userService.setQuizAttemptsCount(this.getUserId(), quizAttempts + 1);
            this.startTimer();
          }
        });
      });
    });
  }

  async loadTechnologyData(): Promise<void> {
    this.quizService.getTechnology(this.technologyName).pipe(first()).subscribe(async res => {
      this.technology = res;
      if (this.technology) {
        this.totalQuestions = await this.quizService.getTotalQuestions(this.technologyName).toPromise() ?? 0;
        this.loadNewQuestion();
      }
    });
  }

  async handleNextClick(): Promise<void> {
    if (this.quizForm.valid) {
      if (!this.question?.id) {
        throw new Error("questionId not found");
      }
      console.log("submitted: ", this.quizForm.get('optionId')?.value);
      await this.quizService.addAttempt({
        userId: this.getUserId(),
        questionId: this.question?.id,
        optionId: this.quizForm.get('optionId')?.value,
      });
      this.loadNewQuestion();
      this.quizForm.reset();
    }
  }

  getUserId(): string {
    if (!this.userId) {
      throw new Error("UserId not found");
    }
    return this.userId;
  }

  getQuestion(questionIdsToExclude: string[]): void {
    this.quizService.getQuestion(this.technologyName, questionIdsToExclude).pipe(first()).subscribe(firstRes => {
      console.log(">>>>> first res", firstRes, questionIdsToExclude);
      if (firstRes.length) {
        this.question = firstRes[0];
        shuffleItems(this.question.options);
      }
      else {
        this.quizService.getQuestion(this.technologyName, questionIdsToExclude, 1).pipe(first()).subscribe(secondRes => {
          console.log(">>>>> second res", secondRes, questionIdsToExclude);
          if (!secondRes.length) {
            throw new Error("Didn't find question");
          }
          this.question = secondRes[0];
          shuffleItems(this.question.options);
        });
      }
    });
  }

  async loadNewQuestion(): Promise<void> {
    this.quizService.getAttemptedQuestions(this.getUserId()).pipe(first()).subscribe(async res => {
      console.log("test", res);
      if (res) {
        this.totalAttemptedQuestions = res.length;
        if (this.totalAttemptedQuestions < this.totalQuestions) {
          this.getQuestion(res.map(attemptedQuestion => attemptedQuestion.questionId));
        } else {
          console.log('All questions attempted. Calculating score...');
          await this.calculateScore();
        }
      } else {
        console.error('Attempted questions data is undefined.');
        this.totalAttemptedQuestions = 0;
      }
    });
  }

  async calculateScore(): Promise<void> {
    const attemptedQuestions = await this.quizService.getAttemptedQuestions(this.getUserId()).toPromise();

    if (attemptedQuestions && this.totalQuestions > 0) {
      const totalQuestions = this.totalQuestions;

      const correctAnswersPromises = attemptedQuestions.map(async attempt => {
        const question = await this.quizService.getQuestionById(this.technologyName, attempt.questionId).toPromise();
        console.log(`Question ID: ${question?.id}, Answer ID: ${question?.answerId}, Attempted Option ID: ${attempt.optionId}`);
        return question && question.answerId === attempt.optionId;
      });

      const correctAnswersArray = await Promise.all(correctAnswersPromises);
      const correctAnswers = correctAnswersArray.filter(isCorrect => isCorrect).length;

      this.userScore = correctAnswers;
      this.scorePercentage = (this.userScore / totalQuestions) * 100;

      console.log(`Total Questions: ${totalQuestions}, Correct Answers: ${correctAnswers}, Score Percentage: ${this.scorePercentage}`);
    } else {
      console.error('Attempted questions data is undefined or totalQuestions is 0.');
      this.userScore = 0;
      this.scorePercentage = 0;
    }
  }

  startTimer(): void {
    const endTime = new Date().getTime() + this.TIMER_DURATION;
    this.timerSubscription = interval(this.TIMER_INTERVAL).subscribe(() => {
      const now = new Date().getTime();
      const timeRemaining = endTime - now;

      if (timeRemaining <= 0) {
        this.timeLeft = '00:00:00';
        this.timerSubscription?.unsubscribe();
      } else {
        const minutes = Math.floor((timeRemaining % (1000 * 3600)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        this.timeLeft = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
      }
    });
  }

  formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
