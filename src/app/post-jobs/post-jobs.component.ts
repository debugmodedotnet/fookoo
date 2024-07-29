import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-post-jobs',
  standalone: true,
  imports: [],
  templateUrl: './post-jobs.component.html',
  styleUrl: './post-jobs.component.scss'
})
export class PostJobsComponent implements OnInit {

  currentStep = 1;
  lastStep = 2;

  @ViewChild('postJobForm', { static: true, read: ViewContainerRef }) postJobForm?: ViewContainerRef;

  ngOnInit(): void {
    this.loadJobForm();
  }

  async loadJobForm() {
    if (this.postJobForm) {
      this.postJobForm.clear();
      if (this.currentStep === 1) {
        const { Jobform1Component } = await import('./jobform-1/jobform-1.component');
        this.postJobForm.createComponent(Jobform1Component);
      } else if (this.currentStep === 2) {
        const { Jobform2Component } = await import('./jobform-2/jobform-2.component');
        this.postJobForm.createComponent(Jobform2Component);
      }
    }
  }

  onNextStep() {
    if (this.currentStep < this.lastStep) {
      this.currentStep++;
      this.loadJobForm();
    }
  }

  onPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.loadJobForm();
    }
  }


}
