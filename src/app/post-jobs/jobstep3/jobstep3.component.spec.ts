import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobstep3Component } from './jobstep3.component';

describe('Jobform3Component', () => {
  let component: Jobstep3Component;
  let fixture: ComponentFixture<Jobstep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobstep3Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Jobstep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
