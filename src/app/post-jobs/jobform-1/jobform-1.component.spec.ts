import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobform1Component } from './jobform-1.component';

describe('Jobform1Component', () => {
  let component: Jobform1Component;
  let fixture: ComponentFixture<Jobform1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobform1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobform1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
