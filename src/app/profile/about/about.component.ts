import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  user: any;
  userProfileForm: FormGroup;
  educations: string[] = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor’s Degree',
    'Master’s Degree',
    'Doctorate (PhD)',
    'Professional Certification',
    'Vocational Training',
    'Technical Diploma',
    'Postgraduate Diploma',
    'Graduate Certificate',
    'Certificate of Completion',
    'Diploma in Applied Sciences',
    'Diploma in Engineering',
    'Certificate in Arts',
    'Advanced Diploma'
  ];
  experiences: string[] = [
    'Internship',
    'Entry Level (0-1 years)',
    'Junior (1-3 years)',
    'Mid-Level (3-5 years)',
    'Senior (5-10 years)',
    'Lead (10-15 years)',
    'Director',
    'Vice President',
    'C-Level Executive',
    'Freelancer',
    'Consultant',
    'Contractor',
    'Advisor',
    'Volunteer',
    'Other'
  ];

  editingIndex = -1;

  private userService = inject(UserService);

  constructor(private fb: FormBuilder) {
    this.userProfileForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      age: [''],
      city: [''],
      twitter: ['', [Validators.pattern('https?://x.com/.+'), Validators.minLength(5)]],
      linkedin: ['', [Validators.pattern('https?://www.linkedin.com/in/.+'), Validators.minLength(5)]],
      github: ['', [Validators.pattern('https?://github.com/.+'), Validators.minLength(5)]],
      skill1: [''],
      skill2: [''],
      skill3: [''],
      skill4: [''],
      bio: [''],
      education: [''],
      experience: [''],
      pastExperiences: this.fb.array([], [Validators.required]),
      openforjob: [false],
      tagline: ['']
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;

        this.userProfileForm.patchValue({
          name: user.name || '',
          position: user.position || '',
          age: user.age || '',
          city: user.city || '',
          twitter: user.twitter || '',
          linkedin: user.linkedin || '',
          github: user.github || '',
          skill1: user.skill1 || '',
          skill2: user.skill2 || '',
          skill3: user.skill3 || '',
          skill4: user.skill4 || '',
          bio: user.bio || '',
          education: user.education || '',
          experience: user.experience || '',
          openforjob: user.openforjob || false,
          tagline: user.tagline || ''
        });

        const pastExperiencesArray = this.userProfileForm.get('pastExperiences') as FormArray;
        pastExperiencesArray.clear();
        if (user.pastExperiences && Array.isArray(user.pastExperiences)) {
          user.pastExperiences.forEach((experience: string) => {
            pastExperiencesArray.push(new FormControl(experience));
          });
        }

      } else {
        this.user = null;
      }
    });
  }

  saveProfile() {
    const userDetails = { ...this.user, ...this.userProfileForm.value };
    this.userService.updateUserProfile(userDetails);
  }

  formattedName(name: string): string {
    return name ? name.toLowerCase().replace(/\s+/g, '') : '';
  }

  get pastExperiences(): FormArray {
    return this.userProfileForm.get('pastExperiences') as FormArray;
  }

  addExperience(inputElement: HTMLInputElement): void {
    const value = inputElement.value.trim();
    if (value) {
      if (this.pastExperiences) {
        if (this.editingIndex === -1) {
          this.pastExperiences.push(new FormControl(value));
        } else {
          const control = this.pastExperiences.at(this.editingIndex) as FormControl;
          if (control) {
            control.setValue(value);
          }
          this.editingIndex = -1;
        }
      }
      inputElement.value = '';
    }
  }

  editExperience(index: number): void {
    const control = this.pastExperiences.at(index) as FormControl;
    if (control) {
      this.editingIndex = index;
      const inputElement = document.querySelector<HTMLInputElement>('#newExperience');
      if (inputElement) {
        inputElement.value = control.value || '';
      }
    }
  }

  removeExperience(index: number): void {
    if (this.pastExperiences.length > 0) {
      this.pastExperiences.removeAt(index);
    }
  }

}