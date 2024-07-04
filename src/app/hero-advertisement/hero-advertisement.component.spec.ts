import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroAdvertisementComponent } from './hero-advertisement.component';

describe('HeroAdvertisementComponent', () => {
  let component: HeroAdvertisementComponent;
  let fixture: ComponentFixture<HeroAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroAdvertisementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
