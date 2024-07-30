import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-jobform-3',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobform-3.component.html',
  styleUrl: './jobform-3.component.scss'
})
export class Jobform3Component {

  @Input() jobForm!: FormGroup;  

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      Location: ['', [Validators.required]],
      Remote: ['false'],
    });
  }

}
