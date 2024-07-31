import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobstep7Component } from './jobstep7.component';

describe('Jobstep7Component', () => {
  let component: Jobstep7Component;
  let fixture: ComponentFixture<Jobstep7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobstep7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobstep7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
