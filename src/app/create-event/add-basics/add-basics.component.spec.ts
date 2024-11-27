import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBasicsComponent } from './add-basics.component';

describe('AddBasicsComponent', () => {
  let component: AddBasicsComponent;
  let fixture: ComponentFixture<AddBasicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBasicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
