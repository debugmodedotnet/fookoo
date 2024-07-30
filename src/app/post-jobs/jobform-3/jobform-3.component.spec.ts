import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobform3Component } from './jobform-3.component';

describe('Jobform3Component', () => {
  let component: Jobform3Component;
  let fixture: ComponentFixture<Jobform3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobform3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobform3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
