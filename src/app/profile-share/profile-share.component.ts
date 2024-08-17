import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { IUser } from '../modules/user';

@Component({
  selector: 'app-profile-share',
  standalone: true,
  imports: [],
  templateUrl: './profile-share.component.html',
  styleUrl: './profile-share.component.scss'
})
export class ProfileShareComponent implements OnInit {

  name?: string | null = null;
  uid: string | null = null;
  userData?: IUser;

  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.name = params.get('name');
      this.uid = params.get('uid');

      console.log(this.uid);
      console.log(this.name);

      if (this.uid) {
        this.loadUserData(this.uid);
      }
    });
  }

  private loadUserData(uid: string): void {
    this.userService.getUserById(uid).subscribe(data => {
      this.userData = data;
      console.log(this.userData);
    });
  }
}
