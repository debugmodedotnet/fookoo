import { Component, model } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step4',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep4.component.html',
  styleUrl: './jobstep4.component.scss',
})
export class Jobstep4Component {
  jobForm: FormGroup;
  editingIndex = -1;
  data = model<any>();
  isResponsibilitiesInValid = false;
  backdata = model<any>();

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      Responsibilities: this.fb.array([], [Validators.required]),
    });
  }

  get responsibilities(): FormArray {
    return this.jobForm.get('Responsibilities') as FormArray;
  }

  addResponsibility(inputElement: HTMLInputElement): void {
    const value = inputElement.value.trim();

    if (value) {
      if (this.editingIndex === -1) {
        this.responsibilities.push(new FormControl(value));
      } else {
        const control = this.responsibilities.at(
          this.editingIndex
        ) as FormControl;
        if (control) {
          control.setValue(value);
        }
        this.editingIndex = -1;
      }
      inputElement.value = '';
    }
  }

  editResponsibility(index: number): void {
    const control = this.responsibilities.at(index) as FormControl;
    if (control) {
      this.editingIndex = index;
      const inputElement =
        document.querySelector<HTMLInputElement>('#newResponsibility');

      if (inputElement) {
        inputElement.value = control.value || '';
      }
    }
  }

  removeResponsibility(index: number): void {
    if (this.responsibilities.length > 1) {
      this.responsibilities.removeAt(index);
    }
  }

  async next() {
    if (this.jobForm.valid) {
      this.isResponsibilitiesInValid = false;

      this.data.set({
        nextStep: 5,
        jobId: this.data(),
        formData: this.jobForm.value,
      });
    } else {
      this.isResponsibilitiesInValid = true;
    }
  }

  cleanMessage(): void {
    this.isResponsibilitiesInValid = false;
  }

  back(): void {
    this.backdata.set({ previousStep: 3, jobId: this.data() });
  }
}
