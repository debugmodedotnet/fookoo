import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-jobform-8',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobform-8.component.html',
  styleUrl: './jobform-8.component.scss'
})
export class Jobform8Component {

  @Input() jobForm!: FormGroup;  

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({ 
      CompanyTwitter: ['', [Validators.pattern('https?://x.com/.+'), Validators.minLength(5)]],
      CompanyLinkedIn: ['', [Validators.pattern('https?://www.linkedin.com/in/.+'), Validators.minLength(5)]],
      CompanyGithub: ['', [Validators.pattern('https?://github.com/.+'), Validators.minLength(5)]],
    });
  }

}
