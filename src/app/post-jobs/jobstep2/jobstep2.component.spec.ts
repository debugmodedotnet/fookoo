import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobstep2Component } from './jobstep2.component';

describe('Jobform3Component', () => {
  let component: Jobstep2Component;
  let fixture: ComponentFixture<Jobstep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobstep2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Jobstep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
