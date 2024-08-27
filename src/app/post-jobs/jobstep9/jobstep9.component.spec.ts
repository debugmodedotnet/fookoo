import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobstep9Component } from './jobstep9.component';

describe('Jobstep9Component', () => {
  let component: Jobstep9Component;
  let fixture: ComponentFixture<Jobstep9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobstep9Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobstep9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
