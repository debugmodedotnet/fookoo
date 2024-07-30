import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-jobform-7',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobform-7.component.html',
  styleUrl: './jobform-7.component.scss'
})
export class Jobform7Component {

  @Input() jobForm!: FormGroup;  

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      JobDescription: ['', Validators.required],
    });
  }

}
