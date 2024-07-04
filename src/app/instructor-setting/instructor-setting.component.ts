import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { InstructorService } from '../services/instructor.service'; // Update with your service
import { IInstructor } from '../models/instructor'; // Update with your model/interface

@Component({
  selector: 'app-instructor-setting',
  templateUrl: './instructor-setting.component.html',
  styleUrls: ['./instructor-setting.component.scss']
})
export class InstructorSettingComponent implements OnInit {
  instructors: IInstructor[] = [];
  instructorForm: FormGroup;
  editMode = false;
  currentInstructorId?: string;
  formVisible = false;
  skills: string[] = ['Skill A', 'Skill B', 'Skill C', 'Skill D']; // Example skills

  constructor(private instructorService: InstructorService, private fb: FormBuilder) {
    this.instructorForm = this.fb.group({
      Id: [''],
      Name: ['', Validators.required],
      Position: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Github: ['', [Validators.required, Validators.pattern('https://github.com/.*')]],
      Twitter: ['', [Validators.required, Validators.pattern('https://twitter.com/.*')]],
      LinkedIn: ['', [Validators.required, Validators.pattern('https://www.linkedin.com/.*')]],
      Skill1: ['', Validators.required],
      Skill2: ['', Validators.required],
      Skill3: ['', Validators.required],
      Skill4: ['', Validators.required],
      Bio: ['', Validators.required],
      ImageUpload: ['']
    });
  }

  ngOnInit(): void {
    this.loadInstructors();
  }

  loadInstructors() {
    this.instructorService.getInstructors().subscribe(
      instructors => {
        this.instructors = instructors;
      },
      error => {
        console.error('Error loading instructors:', error);
      }
    );
  }

  addOrUpdateInstructor() {
    if (this.editMode && this.currentInstructorId) {
      this.updateInstructor(this.currentInstructorId, this.instructorForm.value);
    } else {
      this.addInstructor();
    }
  }

  addInstructor() {
    this.instructorService.addInstructor(this.instructorForm.value).subscribe(
      () => {
        this.resetForm();
        this.loadInstructors(); // Reload instructors after adding
      },
      error => {
        console.error('Error adding instructor:', error);
      }
    );
  }

  updateInstructor(id: string, instructor: IInstructor) {
    this.instructorService.updateInstructor(id, instructor).subscribe(
      () => {
        this.resetForm();
        this.loadInstructors(); // Reload instructors after update
      },
      error => {
        console.error('Error updating instructor:', error);
      }
    );
  }

  editInstructor(instructor: IInstructor) {
    this.instructorForm.patchValue(instructor);
    this.editMode = true;
    this.currentInstructorId = instructor.Id;
    this.formVisible = true; // Show the form
  }

  deleteInstructor(id: string | undefined) {
    if (id) {
      this.instructorService.deleteInstructor(id).subscribe(
        () => {
          this.loadInstructors(); // Reload instructors after deletion
        },
        error => {
          console.error('Error deleting instructor:', error);
        }
      );
    } else {
      console.error('Instructor ID is undefined, cannot delete.');
    }
  }

  resetForm() {
    this.instructorForm.reset();
    this.editMode = false;
    this.currentInstructorId = undefined;
    this.formVisible = false; // Hide the form
  }

  toggleFormVisibility() {
    this.formVisible = !this.formVisible;
    if (!this.formVisible) {
      this.resetForm();
    }
  }

  // Custom validator for URLs
  urlValidator(control: AbstractControl): ValidationErrors | null {
    const url = control.value;
    if (!url || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/.test(url)) {
      return null;
    } else {
      return { url: true };
    }
  }
}
