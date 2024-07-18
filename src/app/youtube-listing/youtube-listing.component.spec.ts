import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeListingComponent } from './youtube-listing.component';

describe('YoutubeListingComponent', () => {
  let component: YoutubeListingComponent;
  let fixture: ComponentFixture<YoutubeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoutubeListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
