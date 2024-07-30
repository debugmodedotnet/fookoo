import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-jobform-4',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobform-4.component.html',
  styleUrl: './jobform-4.component.scss'
})
export class Jobform4Component {

  @Input() jobForm!: FormGroup;  
  availableSkills: string[] = ['Angular', 'React', 'Python', 'System Design'];

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

}
