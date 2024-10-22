import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailPromptComponent } from './verify-email-prompt.component';

describe('VerifyEmailPromptComponent', () => {
  let component: VerifyEmailPromptComponent;
  let fixture: ComponentFixture<VerifyEmailPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEmailPromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEmailPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
