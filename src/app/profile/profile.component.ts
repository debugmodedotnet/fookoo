import { Component, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private userService = inject(UserService);
  private storage = inject(AngularFireStorage);

  defaultImage = 'assets/images/home/defaultUser.jpg';
  user: any;
  currentTab = 'about';

  @ViewChild('profileView', { static: true, read: ViewContainerRef }) profileView?: ViewContainerRef;

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });

    this.loadAbout();
  }

  async loadAbout() {
    const { AboutComponent } = await import('./about/about.component');
    if (this.profileView) {
      this.profileView.clear();
      this.profileView.createComponent(AboutComponent);
      this.currentTab = 'about';
    }
  }

  async loadCertificates() {
    const { CertificatesComponent } = await import('./certificates/certificates.component');
    if (this.profileView) {
      this.profileView.clear();
      this.profileView.createComponent(CertificatesComponent);
      this.currentTab = 'certificates';
    }
  }

  async loadSettings() {
    const { SettingsComponent } = await import('./settings/settings.component');
    if (this.profileView) {
      this.profileView.clear();
      this.profileView.createComponent(SettingsComponent);
      this.currentTab = 'settings';
    }
  }

  // async loadJob() {
  //   const { JobComponent } = await import('./job/job.component');
  //   if (this.profileView) {
  //     this.profileView.clear();
  //     this.profileView.createComponent(JobComponent);
  //     this.currentTab = 'job';
  //   }
  // }

  async loadViewJob() {
    const { ViewJobComponent } = await import('./viewjob/viewjob.component');
    if (this.profileView) {
      this.profileView.clear();
      this.profileView.createComponent(ViewJobComponent);
      this.currentTab = 'viewJob';
    }
  }

  async loadAppliedJob() {
    const { AppliedJobComponent } = await import('./applied-job/applied-job.component');
    if (this.profileView) {
      this.profileView.clear();
      this.profileView.createComponent(AppliedJobComponent);
      this.currentTab = 'appliedJob';
    }
  }

  uploadPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const userId = this.user.uid;
      const filePath = `users/${userId}/photos/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            const userDetails = { ...this.user, photoURL: url };
            this.userService.updateUserProfile(userDetails);
          });
        })
      ).subscribe();
    }
  }

  formattedName(name: string): string {
    return name ? name.toLowerCase().replace(/\s+/g, '') : '';
  }

}