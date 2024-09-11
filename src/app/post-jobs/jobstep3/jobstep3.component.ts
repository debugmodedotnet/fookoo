import { Component, inject, model, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { IJobSteps } from '../../modules/post-job';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-job-step3',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jobstep3.component.html',
  styleUrl: './jobstep3.component.scss',
})
export class Jobstep3Component implements OnInit {

  jobForm: FormGroup;
  data = model<any>();
  backdata = model<any>();

  availableSkills: string[] = [];
  tags: string[] = [];

  minSkillsError = false;
  maxSkillsError = false;
  isTagInValid = false;

  private fb = inject(FormBuilder);
  private firestore = inject(AngularFirestore);

  constructor() {
    this.jobForm = this.fb.group({
      SkillsRequired: this.fb.array(
        [],
        [Validators.required, this.minMaxArrayValidator(1, 3)]
      ),
      Tag: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getFirestoreData();
  }

  getFirestoreData(): void {
    this.firestore
      .collection('post-job')
      .doc<IJobSteps>('job-steps-data')
      .valueChanges()
      .subscribe((doc: IJobSteps | undefined) => {
        this.availableSkills = doc?.skills ?? [];
        this.tags = doc?.tag ?? [];
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
        return this.minSkillsError || this.maxSkillsError
          ? { minMaxSkills: true }
          : null;
      }
      return null;
    };
  }

  toggleSkill(skill: string): void {
    const index = this.skillsRequired.controls.findIndex(
      (x) => x.value === skill
    );
    if (index === -1) {
      if (this.skillsRequired.length < 3) {
        this.skillsRequired.push(this.fb.control(skill));
        this.minSkillsError = false;
        this.maxSkillsError = false;
      } else {
        this.maxSkillsError = true;
      }
    } else {
      this.skillsRequired.removeAt(index);
      this.minSkillsError = this.skillsRequired.length < 1;
    }
    this.logSelectedSkills();
  }

  isSelected(skill: string): boolean {
    return this.skillsRequired.controls.some((x) => x.value === skill);
  }

  logSelectedSkills(): void {
    const selectedSkills = this.skillsRequired.controls.map(
      (control) => control.value
    );    
  }

  next(): void {
    if (this.jobForm.valid) {
      this.isTagInValid = false;
      if (this.skillsRequired.length < 1) {
        this.minSkillsError = true;
        this.maxSkillsError = false;
      } else if (this.skillsRequired.length > 3) {
        this.maxSkillsError = true;
      } else {
        this.minSkillsError = false;
        this.maxSkillsError = false;
        this.data.set({
          nextStep: 4,
          jobId: this.data(),
          formData: this.jobForm.value,
        });
      }
    }
    else {
      if (!this.jobForm.get('Tag')?.valid) {
        this.isTagInValid = true;
      } else if (!this.jobForm.get('SkillsRequired')?.valid) {
        this.minSkillsError = true;
      }
    }
  }

  cleanMessage(): void {
    this.minSkillsError = false;
    this.maxSkillsError = false;
  }

  cleanTagMessage(): void {
    this.isTagInValid = false;
  }

}
