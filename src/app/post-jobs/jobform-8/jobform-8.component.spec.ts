import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobform8Component } from './jobform-8.component';

describe('Jobform8Component', () => {
  let component: Jobform8Component;
  let fixture: ComponentFixture<Jobform8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobform8Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobform8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
