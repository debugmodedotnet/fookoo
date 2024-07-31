import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobstep4Component } from './jobstep4.component';

describe('Jobstep4Component', () => {
  let component: Jobstep4Component;
  let fixture: ComponentFixture<Jobstep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobstep4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobstep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
