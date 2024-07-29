import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobform2Component } from './jobform-2.component';

describe('Jobform2Component', () => {
  let component: Jobform2Component;
  let fixture: ComponentFixture<Jobform2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobform2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobform2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
