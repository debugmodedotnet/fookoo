import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobstep8Component } from './jobstep8.component';

describe('Jobstep8Component', () => {
  let component: Jobstep8Component;
  let fixture: ComponentFixture<Jobstep8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobstep8Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobstep8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
