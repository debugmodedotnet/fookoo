import { Component, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs';
import { AboutComponent } from './about/about.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { SettingsComponent } from './settings/settings.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { set } from 'firebase/database';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private userService = inject(UserService);
  user: any;
  private storage = inject(AngularFireStorage);
  private db = inject(AngularFirestore);
  showAbout = true;
  showCerficates = false; 
  showSettings = false;
  @ViewChild('profileView',{static:true,read:ViewContainerRef}) profileView?: ViewContainerRef;
  // userProfileForm: FormGroup;

  // constructor() { 
  //   this.userProfileForm = new FormGroup({
  //     name: new FormControl(''), 
  //     password: new FormControl(''),
  //     position: new FormControl(''),
  //     age: new FormControl(''),
  //     city: new FormControl(''),
  //     twitter: new FormControl(''),
  //     linkedin: new FormControl(''),
  //     github: new FormControl(''),
  //     photoURL: new FormControl(''),
  //     skill1: new FormControl(''),
  //     skill2: new FormControl(''),
  //     skill3: new FormControl(''),
  //     skill4: new FormControl(''),
  //     resumeURL: new FormControl(''),
  //     bio: new FormControl(''),
  //     openforjob: new FormControl(''),
  //     tagline: new FormControl(''),
  //   });
  // }


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

  // saveProfile(){
  //   console.log("hey");
  //   const userDetails = { ...this.user, ...this.userProfileForm.value };
  //   console.log(this.user.id);
  //   this.userService.updateUserProfile(userDetails);
  // }

 async loadAbout(){
    // this.showAbout = true;
    // this.showCerficates = false; 
    // this.showSettings = false;
    const {AboutComponent} = await import('./about/about.component');
    if(this.profileView){
      this.profileView.clear();
      this.profileView.createComponent(AboutComponent);
    }
  }
  async loadCertictaes(){
    // this.showAbout = false;
    // this.showCerficates = true; 
    // this.showSettings = false;
    const {CertificatesComponent} = await import('./certificates/certificates.component');
    if(this.profileView){
      this.profileView.clear();
      this.profileView.createComponent(CertificatesComponent);
    }
  }
  async loadSetings(){
    // this.showAbout = false;
    // this.showCerficates = false; 
    // this.showSettings = true;
    const {SettingsComponent} = await import('./settings/settings.component');
    if(this.profileView){
      this.profileView.clear();
      this.profileView.createComponent(SettingsComponent);
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
      ).subscribe(data=>{
       
      });
    }
  }

}
