import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NgIf } from '@angular/common';
import { JobService } from '../job.service';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './job.component.html',
  styleUrl: './job.component.scss'
})
export class JobComponent implements OnInit{
  jobForm: FormGroup;

  constructor(private fb: FormBuilder, private jobService: JobService) {
    this.jobForm = this.fb.group({
      CompanyName: ['', Validators.required],
      CompanyUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      JobDescription: ['', Validators.required],
      SkillsRequired: ['', Validators.required],
      Location: ['', Validators.required],
      Remote: [false],
      CompanyGithub: ['', [Validators.pattern('https://github.com/.+')]],
      CompanyTwitter: ['', [Validators.pattern('https://twitter.com/.+')]],
      CompanyLinkedIn: ['', [Validators.pattern('https://www.linkedin.com/.+')]]
    });
  }

  ngOnInit(): void {}

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
