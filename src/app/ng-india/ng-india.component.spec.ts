import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgIndiaComponent } from './ng-india.component';

describe('NgIndiaComponent', () => {
  let component: NgIndiaComponent;
  let fixture: ComponentFixture<NgIndiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgIndiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
