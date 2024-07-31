import { Component, model } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

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
  minSkillsError = false;
  maxSkillsError = false;


  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      SkillsRequired: this.fb.array([], [Validators.required, this.minMaxArrayValidator(1, 3)]),
    });
  }

  get skillsRequired(): FormArray {
    return this.jobForm.get('SkillsRequired') as FormArray;
  }

  minMaxArrayValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const length = formArray.length;
      if (length > 0) {
        this.minSkillsError = length < min;
        this.maxSkillsError = length > max;
        return this.minSkillsError || this.maxSkillsError ? { minMaxSkills: true } : null;
      }
      return null; // No error if the array is empty
    };
  }


    toggleSkill(skill: string): void {
      const index = this.skillsRequired.controls.findIndex(x => x.value === skill);
      if (index === -1) {
        if (this.skillsRequired.length < 3) {
          this.skillsRequired.push(this.fb.control(skill));
          this.minSkillsError = false;
          this.maxSkillsError = false;
        } else {
          this.maxSkillsError = true; // Show max skills error
        }
      } else {
        this.skillsRequired.removeAt(index);
        this.minSkillsError = this.skillsRequired.length < 1; // Check min skills error
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
    if (this.jobForm.valid) {
      if (this.skillsRequired.length < 1) {
        this.minSkillsError = true;
        this.maxSkillsError = false;
      } else if (this.skillsRequired.length > 3) {
        this.maxSkillsError = true;
      } else {
        this.minSkillsError = false;
        this.maxSkillsError = false;
        this.data.set({ nextStep: 5, jobId: this.data(), formData: this.jobForm.value });
      }
    } else {
      this.minSkillsError = true;
    }
  }

  cleanMessage(): void {
    this.minSkillsError = false;
    this.maxSkillsError = false;
  }

}
