import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../modules/job';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs';

@Component({
  selector: 'app-view-job',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './viewjob.component.html',
  styleUrls: ['./viewjob.component.scss']
})
export class ViewJobComponent implements OnInit {
  jobs: Job[] = [];
  loading = true;
  jobForm: FormGroup;
  editMode = false;
  currentJobId: string | null = null;
  private jobService = inject(JobService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  userId?: string;

  tags: string[] = ['Angular', 'React', 'GenAI', 'JavaScript', 'TypeScript'];
  positions: string[] = ['Software Engineer', 'ML Engineer', 'Software Developer', 'Social Media Management', 'Senior Software Engineer', 'Intern'];

  private afAuth = inject(AngularFireAuth);

  constructor() {
    this.jobForm = this.fb.group({
      CompanyName: new FormControl<string | null>(null, Validators.required),
      CompanyUrl: new FormControl<string | null>(null, [Validators.required, Validators.pattern('https?://.+')]),
      JobDescription: new FormControl<string | null>(null, Validators.required),
      Responsibilities: this.fb.array<FormControl<string | null>>([]),
      Qualification: this.fb.array<FormControl<string | null>>([]),
      SkillsRequired: new FormControl<string | null>(null, Validators.required),
      Location: new FormControl<string | null>(null, Validators.required),
      Remote: new FormControl<boolean>(false),
      CompanyTwitter: new FormControl<string | null>(null, [Validators.pattern('https?://x.com/.+'), Validators.minLength(5)]),
      CompanyLinkedIn: new FormControl<string | null>(null, [Validators.pattern('https?://www.linkedin.com/in/.+'), Validators.minLength(5)]),
      CompanyGithub: new FormControl<string | null>(null, [Validators.pattern('https?://github.com/.+'), Validators.minLength(5)]),
      Position: new FormControl<string | null>(null, Validators.required),
      Email: new FormControl<string | null>(null, [Validators.email]),
      PhoneNo: new FormControl<string | null>(null, [Validators.pattern('^[0-9]+$')]),
      Tag: new FormControl<string | null>(null),
      ImageUrl: new FormControl<string | null>(null, [Validators.required, Validators.pattern('https?://.+')]),
      Private: new FormControl(false)
    });
  }

  ngOnInit(): void {
    console.log("here")
    this.afAuth.user.pipe(first()).subscribe(res => {
      console.log(res)
      this.userId = res?.uid;
      this.loadJobs();
    });
  }

  loadJobs(): void {
    this.loading = true;
    this.jobService.getJobsByUserId(this.getUserId()).subscribe(
      (jobs: Job[]) => {
        console.log('Loaded jobs:', jobs); // Debugging line to check the jobs array
        this.jobs = jobs;
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
      console.log('Editing job:', job); // Debugging line to check the job object
      this.jobForm.patchValue({
        CompanyName: job.companyName,
        CompanyUrl: job.CompanyUrl,
        JobDescription: job.JobDescription,
        SkillsRequired: job.SkillsRequired,
        Location: job.Location,
        Remote: job.Remote,
        CompanyTwitter: job.CompanyTwitter,
        CompanyLinkedIn: job.CompanyLinkedIn,
        CompanyGithub: job.CompanyGithub,
        Position: job.position,
        Email: job.Email,
        PhoneNo: job.PhoneNo,
        Tag: job.Tag,
        ImageUrl: job.ImageUrl,
        Private: job.Private
      });

      // Clear existing responsibilities and qualifications
      this.responsibilities.clear();
      job.Responsibilities.forEach(res => this.addResponsibility(res));
      
      this.qualifications.clear();
      job.qualification.forEach(qual => this.addQualification(qual));

      this.currentJobId = job.id;
      this.editMode = true;
    } else {
      console.error('Job is undefined or job ID is missing:', job);
    }
  }

  updateJob(): void {
    if (this.jobForm.valid && this.currentJobId) {
      const updatedJob = {
        ...this.jobForm.value,
        Responsibilities: (this.jobForm.get('Responsibilities') as FormArray).controls.map(c => c.value),
        Qualification: (this.jobForm.get('Qualification') as FormArray).controls.map(c => c.value),
        userId: this.getUserId()
      };

      this.jobService.updateJob(this.currentJobId, updatedJob).then(() => {
        this.editMode = false;
        this.resetForm();
        this.loadJobs();
      }).catch((err: any) => {
        console.error('Update failed', err);
      });
    } else {
      this.jobForm.markAllAsTouched(); // Show validation errors
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

  resetForm(): void {
    this.jobForm.reset({
      CompanyName: '',
      CompanyUrl: '',
      JobDescription: '',
      Responsibilities: [],
      Qualification: [],
      SkillsRequired: '',
      Location: '',
      Remote: false,
      CompanyGithub: '',
      CompanyTwitter: '',
      CompanyLinkedIn: '',
      Email: '',
      PhoneNo: '',
      Tag: '',
      ImageUrl: '',
      Private: false
    });
    this.editMode = false;
    this.currentJobId = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  get responsibilities(): FormArray {
    return this.jobForm.get('Responsibilities') as FormArray;
  }

  get qualifications(): FormArray {
    return this.jobForm.get('Qualification') as FormArray;
  }

  addResponsibility(responsibility: string): void {
    if (responsibility) {
      this.responsibilities.push(this.fb.control(responsibility));
    }
  }

  removeResponsibility(index: number): void {
    this.responsibilities.removeAt(index);
  }

  addQualification(qualification: string): void {
    if (qualification) {
      this.qualifications.push(this.fb.control(qualification));
    }
  }

  removeQualification(index: number): void {
    this.qualifications.removeAt(index);
  }

  getUserId(): string {
    if (!this.userId) {
      throw new Error("UserId not found");
    }
    return this.userId;
  }
}

