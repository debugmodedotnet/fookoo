import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-profile-share',
  standalone: true,
  imports: [],
  templateUrl: './profile-share.component.html',
  styleUrl: './profile-share.component.scss'
})
export class ProfileShareComponent {
  
  name: string | null = null;
  uid: string | null = null;
  userData: any; 
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  constructor() { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.name = params.get('name');
      this.uid = params.get('uid');
      if (this.uid) {
        this.loadUserData(this.uid);
      }
    });
  }
  private loadUserData(uid: string): void {
    this.userService.getUserById(uid).subscribe(data => {
      this.userData = data;
    });
  }
}
