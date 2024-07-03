import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  private userService = inject(UserService);
  user: any;
  userProfileForm: FormGroup;

  constructor() {
    this.userProfileForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
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
