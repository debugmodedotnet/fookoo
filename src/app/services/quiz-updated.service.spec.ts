import { TestBed } from '@angular/core/testing';

import { QuizUpdatedService } from './quiz-updated.service';

describe('QuizUpdatedService', () => {
  let service: QuizUpdatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizUpdatedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
