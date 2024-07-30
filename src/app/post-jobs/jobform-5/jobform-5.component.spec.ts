import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobform5Component } from './jobform-5.component';

describe('Jobform5Component', () => {
  let component: Jobform5Component;
  let fixture: ComponentFixture<Jobform5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobform5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jobform5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
