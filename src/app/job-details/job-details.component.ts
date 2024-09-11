import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../services/job.service';
import { Job } from '../modules/job';
import { UserService } from '../services/user.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IUser } from '../modules/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent implements OnInit {

  job: Job | null = null;
  defaultImage = 'assets/images/home/default_company.png';
  user: any;
  jobDescriptionHtml!: SafeHtml;
  applied = false;
  isLoading = false;
  private id: string | null = null;

  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private userService = inject(UserService);
  public router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.jobService.getJobById(this.id).subscribe({
        next: (data) => {
          if (data) {
            this.job = data;
            this.jobDescriptionHtml = this.sanitizer.bypassSecurityTrustHtml(data.JobDescription || '');

            this.userService.getCurrentUser().subscribe(user => {
              if (user) {
                this.user = user;
                this.checkIfApplied(user);
              }
            });
          }
        },        
      });
    }

    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  applyJob() {
    if (!this.user) {     
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }
  }

  jobApply(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        if (this.applied || this.isLoading) {
          return;
        }
        this.submitApplication(user);
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      }
    });
  }

  submitApplication(user: IUser) {
    if (!this.id) {      
      return;
    }

    this.isLoading = true;
    const userData = {
      name: user.name || '',
      image: user.photoURL || '',
      email: user.email || ''
    };

    const eventRef = this.firestore.collection('job-transactions').doc(this.id);
    const userRef = eventRef.collection('users').doc(user.uid);

    userRef.set(userData).then(() => {
      this.applied = true;
      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
    });
  }

  checkIfApplied(user: IUser) {
    if (!this.id) {
      return;
    }

    const eventRef = this.firestore.collection('job-transactions').doc(this.id);
    const userRef = eventRef.collection('users').doc(user.uid);

    userRef.get().subscribe((doc) => {
      if (doc.exists) {
        this.applied = true;
      }
    });
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
