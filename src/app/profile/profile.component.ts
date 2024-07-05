import { Component, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private userService = inject(UserService);
  private storage = inject(AngularFireStorage);

  user: any;
  currentTab: string = 'about';

  @ViewChild('profileView', { static: true, read: ViewContainerRef }) profileView?: ViewContainerRef;

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        console.log("User is logged in", user);
        this.user = user;
      } else {
        console.log("No user is logged in");
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

  async loadJob() {
    const { JobComponent } = await import('../job/job.component');
    if (this.profileView) {
      this.profileView.clear();
      this.profileView.createComponent(JobComponent);
      this.currentTab = 'job';
    }
  }

  uploadPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Create a unique file path
      const filePath = `userPhotos/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {

            const userDetails = { ...this.user, photoURL: url };
            this.userService.updateUserProfile(userDetails);
          });
        })
      ).subscribe(data => {
      });
    }
  }

}
