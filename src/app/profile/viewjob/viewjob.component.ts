import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl, FormsModule } from '@angular/forms';
import { first } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { JobService } from '../../services/job.service';
import { SalValidator } from '../../post-jobs/jobstep5/sal-validator';
import { Job } from '../../modules/job';
import { IJobSteps } from '../../modules/post-job';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-view-job',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, QuillModule],
  templateUrl: './viewjob.component.html',
  styleUrls: ['./viewjob.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewJobComponent implements OnInit {

  jobs: Job[] = [];
  loading = true;
  jobForm: FormGroup;
  editMode = false;
  currentJobId: string | null = null;
  userId?: string;
  loggedInEmail: string | null | undefined;
  quillConfig: any;

  positions: string[] = [];
  qualifications: string[] = [];
  noticePeriods: string[] = [];
  availableSkills: string[] = [];
  tags: string[] = [];
  minSkillsError = false;
  maxSkillsError = false;
  editingIndex = -1;
  isResponsibilitiesInValid = false;

  private jobService = inject(JobService);
  private fb = inject(FormBuilder);
  private afAuth = inject(AngularFireAuth);
  private firestore = inject(AngularFirestore);

  constructor() {
    this.jobForm = this.fb.group(
      {
        companyName: ['', Validators.required],
        position: ['', Validators.required],
        CompanyUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
        qualification: ['', Validators.required],
        tagline: ['', Validators.required],
        Location: ['', [Validators.required, Validators.minLength(3)]],
        Remote: [false],
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
    this.afAuth.user.pipe(first()).subscribe(res => {
      console.log(res);
      this.userId = res?.uid;
      this.loggedInEmail = res?.email;
      this.loadJobs();
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
    console.log('Selected Skills:', selectedSkills);
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


  loadJobs(): void {
    this.loading = true;
    this.jobService.getJobsByUserId(this.loggedInEmail as string).subscribe(
      (jobs: Job[]) => {
        //console.log('Loaded jobs:', jobs);
        this.jobs = jobs;
        //console.log(this.jobs);
        this.loading = false;
      },
      (error: any) => {
        console.error('Error loading jobs:', error);
        this.loading = false;
      }
    );
  }

  editJob(job: Job): void {
    if (job && job.id) {
      console.log('Editing job:', job);

      this.jobForm.patchValue({
        companyName: job.companyName,
        position: job.position,
        CompanyUrl: job.CompanyUrl,
        qualification: job.qualification,
        tagline: job.tagline,
        Location: job.Location,
        Remote: job.Remote,
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
    } else {
      console.error('Job is undefined or job ID is missing:', job);
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
        tagline: formValues.tagline || '',
        Location: formValues.Location || '',
        Remote: formValues.Remote || false,
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
          this.loadJobs();
        })
        .catch((err: any) => {
          console.error('Update failed', err);
        });
    } else {
      this.jobForm.markAllAsTouched();
    }
  }

  deleteJob(jobId?: string): void {
    if (jobId) {
      this.jobService.deleteJob(jobId)
        .then(() => {
          this.loadJobs();
        })
        .catch(error => {
          console.error('Error deleting job:', error);
        });
    } else {
      console.error('Job ID is undefined.');
    }
  }

  deactivateJob(jobId?: string, jobStatus?: boolean): void {
    if (jobId) {
      this.jobService.updateJob(jobId, { isActive: !jobStatus })
        .then(() => {
          this.loadJobs();
        })
        .catch(error => {
          console.error('Error deactivating job:', error);
        });
    } else {
      console.error('Job ID is undefined.');
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
      Remote: false,
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
}

