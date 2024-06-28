import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor() { }

  private userService = inject(UserService);
  user: any;

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
  }

  editProfile() {
    console.log('Edit Profile button clicked');
  }

  viewCertificate() {
    console.log('Certificate button clicked');
  }

  viewEvents() {
    console.log('Events button clicked');
  }

}
