import { Component, model } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-step4',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep4.component.html',
  styleUrl: './jobstep4.component.scss'
})
export class Jobstep4Component {

  jobForm: FormGroup;
  availableSkills: string[] = ['Angular', 'React', 'Python', 'System Design'];
  data = model<any>();

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      SkillsRequired: this.fb.array([], [Validators.required]),
    });
  }

  get skillsRequired(): FormArray {
    return this.jobForm.get('SkillsRequired') as FormArray;
  }

  toggleSkill(skill: string): void {
    const index = this.skillsRequired.controls.findIndex(x => x.value === skill);
    if (index === -1) {
      this.skillsRequired.push(this.fb.control(skill));
    } else {
      this.skillsRequired.removeAt(index);
    }
    this.logSelectedSkills();
  }

  isSelected(skill: string): boolean {
    return this.skillsRequired.controls.some(x => x.value === skill);
  }

  logSelectedSkills(): void {
    const selectedSkills = this.skillsRequired.controls.map(control => control.value);
    console.log('Selected Skills:', selectedSkills);
  }

  async next() {
    this.data.set({ nextStep: 5, jobId: this.data(), formData: this.jobForm.value });
  }


}
