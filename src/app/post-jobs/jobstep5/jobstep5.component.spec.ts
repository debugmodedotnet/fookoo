import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobstep5Component } from './jobstep5.component';

describe('Jobstep5Component', () => {
  let component: Jobstep5Component;
  let fixture: ComponentFixture<Jobstep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobstep5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobstep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
