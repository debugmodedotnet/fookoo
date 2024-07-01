import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  private userService = inject(UserService);
  user: any;
  private storage = inject(AngularFireStorage);
  private db = inject(AngularFirestore);
  userProfileForm: FormGroup;

  constructor() { 
    this.userProfileForm = new FormGroup({
      name: new FormControl(''), 
      password: new FormControl(''),
      position: new FormControl(''),
      age: new FormControl(''),
      city: new FormControl(''),
      twitter: new FormControl(''),
      linkedin: new FormControl(''),
      github: new FormControl(''),
      photoURL: new FormControl(''),
      skill1: new FormControl(''),
      skill2: new FormControl(''),
      skill3: new FormControl(''),
      skill4: new FormControl(''),
      resumeURL: new FormControl(''),
      bio: new FormControl(''),
      openforjob: new FormControl(''),
      tagline: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        console.log("User is logged in", user);
        this.user = user;
        this.userProfileForm.patchValue(user);
      } else {
        console.log("No user is logged in");
        this.user = null;
      }
    });

  }

  saveProfile(){
    console.log("hey");
    const userDetails = { ...this.user, ...this.userProfileForm.value };
    console.log(this.user.id);
    this.userService.updateUserProfile(userDetails);
  }


}
