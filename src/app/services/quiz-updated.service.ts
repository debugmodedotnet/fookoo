import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizUpdatedService {

  private http = inject(HttpClient);

  constructor() { }

  createQuiz(quiz: any) {

     const token = localStorage.getItem('token');
     if (!token) {
       throw new Error('Token not found in local storage');
     }

     const headers = new HttpHeaders({
       Authorization: `Bearer ${token}`,
     });

     return this.http.get('http://localhost:3000/create', { headers });
  }
}
