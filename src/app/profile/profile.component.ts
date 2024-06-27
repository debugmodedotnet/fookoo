import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor() {}

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
