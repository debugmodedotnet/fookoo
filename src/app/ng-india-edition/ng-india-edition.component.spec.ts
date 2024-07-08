import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgIndiaEditionComponent } from './ng-india-edition.component';

describe('NgIndiaEditionComponent', () => {
  let component: NgIndiaEditionComponent;
  let fixture: ComponentFixture<NgIndiaEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgIndiaEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgIndiaEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
