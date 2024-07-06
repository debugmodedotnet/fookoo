import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
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
      CompanyLinkedIn: ['', [Validators.pattern('https://www.linkedin.com/.+')]],
      Position: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      Tag: [''],
      ImageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
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
