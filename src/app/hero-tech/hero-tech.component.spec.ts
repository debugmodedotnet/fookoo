import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroTechComponent } from './hero-tech.component';

describe('HeroTechComponent', () => {
  let component: HeroTechComponent;
  let fixture: ComponentFixture<HeroTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroTechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
