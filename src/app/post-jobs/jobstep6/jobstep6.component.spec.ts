import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobstep6Component } from './jobstep6.component';

describe('Jobstep6Component', () => {
  let component: Jobstep6Component;
  let fixture: ComponentFixture<Jobstep6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobstep6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobstep6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
