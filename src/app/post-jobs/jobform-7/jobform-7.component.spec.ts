import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobform7Component } from './jobform-7.component';

describe('Jobform7Component', () => {
  let component: Jobform7Component;
  let fixture: ComponentFixture<Jobform7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobform7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobform7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
