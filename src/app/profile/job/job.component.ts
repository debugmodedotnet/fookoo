import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {

  jobForm: FormGroup;
  private jobService = inject(JobService);

  constructor() {
    this.jobForm = new FormGroup({
      CompanyName: new FormControl('', Validators.required),
      CompanyUrl: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
      JobDescription: new FormControl('', Validators.required),
      SkillsRequired: new FormControl('', Validators.required),
      Location: new FormControl('', Validators.required),
      Remote: new FormControl(false),
      CompanyTwitter: new FormControl('', [Validators.required, Validators.pattern('https?://x.com/.+'), Validators.minLength(5)]),
      CompanyLinkedIn: new FormControl('', [Validators.required, Validators.pattern('https?://www.linkedin.com/in/.+'), Validators.minLength(5)]),
      CompanyGithub: new FormControl('', [Validators.required, Validators.pattern('https?://github.com/.+'), Validators.minLength(5)]),
      Position: new FormControl('', Validators.required),
      Email: new FormControl('', [Validators.required, Validators.email]),
      PhoneNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      Tag: new FormControl(''),
      ImageUrl: new FormControl('', [Validators.required, Validators.pattern('https?://.+')])
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.jobForm.valid) {
      this.jobService.addJob(this.jobForm.value)
        .then(() => {
          console.log('Job successfully added!');
          this.jobForm.reset();  // Reset form after submission
        })
        .catch(error => {
          console.error('Error adding job: ', error);
        });
    } else {
      console.log('Form is invalid!');
    }
  }
}
