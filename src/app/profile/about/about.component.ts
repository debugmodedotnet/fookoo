import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  private userService = inject(UserService);
  user: any;
  userProfileForm: FormGroup;

  constructor() {
    this.userProfileForm = new FormGroup({
      name: new FormControl(''),
      position: new FormControl(''),
      age: new FormControl(''),
      city: new FormControl(''),
      twitter: new FormControl('', [Validators.pattern('https?://x.com/.+'), Validators.minLength(5)]),
      linkedin: new FormControl('', [Validators.pattern('https?://www.linkedin.com/in/.+'), Validators.minLength(5)]),
      github: new FormControl('', [Validators.pattern('https?://github.com/.+'), Validators.minLength(5)]),
      skill1: new FormControl(''),
      skill2: new FormControl(''),
      skill3: new FormControl(''),
      skill4: new FormControl(''),
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

  saveProfile() {
    console.log("hey");
    const userDetails = { ...this.user, ...this.userProfileForm.value };
    console.log(this.user.id);
    this.userService.updateUserProfile(userDetails);
  }

}