import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-jobform-6',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobform-6.component.html',
  styleUrl: './jobform-6.component.scss'
})
export class Jobform6Component {

  @Input() jobForm!: FormGroup;  

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      MinSalary: ['', Validators.required],
      MaxSalary: ['', Validators.required],
    });
  }

}
