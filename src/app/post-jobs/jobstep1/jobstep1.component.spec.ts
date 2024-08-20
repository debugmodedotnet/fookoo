import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobstep1Component } from './jobstep1.component';

describe('Jobform2Component', () => {
  let component: Jobstep1Component;
  let fixture: ComponentFixture<Jobstep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobstep1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Jobstep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
