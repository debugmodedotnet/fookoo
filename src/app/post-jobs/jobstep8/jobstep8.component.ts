import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl, FormsModule } from '@angular/forms';
import { first } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Job } from '../../modules/job';
import { JobService } from '../../services/job.service';
import { SalValidator } from '../jobstep5/sal-validator';
import { IJobSteps } from '../../modules/post-job';
import { QuillModule } from 'ngx-quill';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-job-step8',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, QuillModule],
  templateUrl: './jobstep8.component.html',
  styleUrl: './jobstep8.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Jobstep8Component implements OnInit {

  backdata = model<any>();
  data = model<any>();
  job: Job | null = null;
  jobs: Job[] = [];
  loading = true;
  jobForm: FormGroup;
  editMode = false;
  currentJobId: string | null = null;
  userId?: string;
  loggedInEmail: string | null | undefined;
  quillConfig: any;
  jobDescriptionHtml!: SafeHtml;

  positions: string[] = [];
  qualifications: string[] = [];
  availableSkills: string[] = [];
  noticePeriods: string[] = [];
  jobTypes: string[] = [];
  tags: string[] = [];
  minSkillsError = false;
  maxSkillsError = false;
  editingIndex = -1;
  isResponsibilitiesInValid = false;

  private jobService = inject(JobService);
  private fb = inject(FormBuilder);
  private afAuth = inject(AngularFireAuth);
  private firestore = inject(AngularFirestore);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.jobForm = this.fb.group(
      {
        companyName: ['', Validators.required],
        position: ['', Validators.required],
        CompanyUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
        qualification: ['', Validators.required],
        //tagline: ['', Validators.required],
        Location: ['', [Validators.required, Validators.minLength(3)]],
        jobType: ['', [Validators.required]],
        Tag: ['', [Validators.required]],
        SkillsRequired: this.fb.array([], [Validators.required]),
        Responsibilities: this.fb.array([], [Validators.required]),
        MinSalary: ['', Validators.required],
        MaxSalary: ['', Validators.required],
        noticePeriod: ['', Validators.required],
        JobDescription: ['', [Validators.required, Validators.minLength(200)]],
        CompanyLinkedIn: ['', [Validators.pattern('https?://www.linkedin.com/in/.+'), Validators.minLength(5)]],
        CompanyGithub: ['', [Validators.pattern('https?://github.com/.+'), Validators.minLength(5)]],
        CompanyTwitter: ['', [Validators.pattern('https?://x.com/.+'), Validators.minLength(5)]],
        isActive: [false]
      },
      { validator: SalValidator });
  }

  ngOnInit(): void {
    const jobId = this.data();    

    if (jobId) {
      this.jobService.getJobById(jobId).subscribe({
        next: (data) => {
          if (data) {
            this.job = data;
            this.jobDescriptionHtml = this.sanitizer.bypassSecurityTrustHtml(data.JobDescription || '');
          }
        },
      });
    }

    this.afAuth.user.pipe(first()).subscribe(res => {      
      this.userId = res?.uid;
      this.loggedInEmail = res?.email;
    });

    this.getFirestoreData();
  }

  getFirestoreData(): void {
    this.firestore
      .collection('post-job')
      .doc<IJobSteps>('job-steps-data')
      .valueChanges()
      .subscribe((doc: IJobSteps | undefined) => {
        this.positions = doc?.position ?? [];
        this.qualifications = doc?.qualification ?? [];
        this.noticePeriods = doc?.noticePeriod ?? [];
        this.availableSkills = doc?.skills ?? [];
        this.tags = doc?.tag ?? [];
        this.jobTypes = doc?.jobType ?? [];
      });
  }

  /********************* Skills *********************/
  get skillsRequired(): FormArray {
    return this.jobForm.get('SkillsRequired') as FormArray;
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
  }  /********************* Skill End *********************/


  /********************* Responsibilities *********************/
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
  }  /********************* Responsibilities End *********************/


  editJob(job: Job | null): void {
    if (job && job.id) {      
      this.jobForm.patchValue({
        companyName: job.companyName,
        position: job.position,
        CompanyUrl: job.CompanyUrl,
        qualification: job.qualification,
        //tagline: job.tagline,
        Location: job.Location,
        jobType: job.jobType,
        Tag: job.Tag,
        MinSalary: job.MinSalary,
        MaxSalary: job.MaxSalary,
        noticePeriod: job.noticePeriod,
        JobDescription: job.JobDescription,
        CompanyTwitter: job.CompanyTwitter,
        CompanyLinkedIn: job.CompanyLinkedIn,
        CompanyGithub: job.CompanyGithub,
        isActive: job.isActive
      });

      const skillsRequiredArray = this.jobForm.get('SkillsRequired') as FormArray;
      skillsRequiredArray.clear();
      (job.SkillsRequired || []).forEach(skill => {
        skillsRequiredArray.push(new FormControl(skill));
      });

      const responsibilitiesArray = this.jobForm.get('Responsibilities') as FormArray;
      responsibilitiesArray.clear();
      (job.Responsibilities || []).forEach(responsibility => {
        responsibilitiesArray.push(new FormControl(responsibility));
      });

      this.currentJobId = job.id;
      this.editMode = true;
    }
  }

  updateJob(): void {
    if (this.jobForm.valid && this.currentJobId) {
      const formValues = this.jobForm.value;

      const updatedJob = {
        companyName: formValues.companyName || '',
        position: formValues.position || '',
        CompanyUrl: formValues.CompanyUrl || '',
        qualification: formValues.qualification || '',
        //tagline: formValues.tagline || '',
        Location: formValues.Location || '',
        jobType: formValues.jobType || '',
        Tag: formValues.Tag || '',
        SkillsRequired: (this.jobForm.get('SkillsRequired') as FormArray).controls.map(control => control.value) || [],
        Responsibilities: (this.jobForm.get('Responsibilities') as FormArray).controls.map(control => control.value) || [],
        MinSalary: formValues.MinSalary || '',
        MaxSalary: formValues.MaxSalary || '',
        noticePeriod: formValues.noticePeriod || '',
        JobDescription: formValues.JobDescription || '',
        CompanyTwitter: formValues.CompanyTwitter || '',
        CompanyLinkedIn: formValues.CompanyLinkedIn || '',
        CompanyGithub: formValues.CompanyGithub || '',
        isActive: formValues.isActive !== undefined ? formValues.isActive : false, 
        userId: this.getUserId()
      };

      const validUpdatedJob = Object.fromEntries(
        Object.entries(updatedJob).filter(([_, value]) => value !== undefined)
      );

      this.jobService.updateJob(this.currentJobId, validUpdatedJob)
        .then(() => {
          this.editMode = false;
          this.resetForm();
        });
    } else {
      this.jobForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.jobForm.reset({
      companyName: '',
      position: '',
      CompanyUrl: '',
      qualification: '',
      tagline: '',
      Location: '',
      jobType: '',
      Tag: '',
      SkillsRequired: [],
      Responsibilities: [],
      MinSalary: '',
      MaxSalary: '',
      noticePeriod: '',
      JobDescription: '',
      CompanyGithub: '',
      CompanyTwitter: '',
      CompanyLinkedIn: '',
      isActive: false

    });
    this.editMode = false;
    this.currentJobId = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  getUserId(): string {
    if (!this.userId) {
      throw new Error("UserId not found");
    }
    return this.userId;
  }

  shareOnLinkedIn(): void {
    const position = this.job?.position || '';
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(position)}`;
    window.open(url, '_blank');
  }

  shareOnWhatsApp(): void {
    const position = this.job?.position || '';
    const url = `https://wa.me/?text=${encodeURIComponent(position + ' - ' + window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnTwitter(): void {
    const position = this.job?.position || '';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(position)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnInstagram(): void {
    alert('Instagram sharing is not supported directly via a URL.');
  }
}
