import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobform6Component } from './jobform-6.component';

describe('Jobform6Component', () => {
  let component: Jobform6Component;
  let fixture: ComponentFixture<Jobform6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobform6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobform6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
