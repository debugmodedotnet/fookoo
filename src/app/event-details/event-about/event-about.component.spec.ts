import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAboutComponent } from './event-about.component';

describe('EventAboutComponent', () => {
  let component: EventAboutComponent;
  let fixture: ComponentFixture<EventAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
