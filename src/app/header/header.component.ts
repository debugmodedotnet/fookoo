import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  user: any;
  profileImg = 'assets/images/home/user.png';

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        console.log('User is logged in', user);
        
        this.user = user;
        console.log(this.user.uid);

        this.profileImg = user.photoURL;
        console.log(this.profileImg);
        
        if (this.profileImg == null) {
          this.profileImg = 'assets/images/home/user.png';
        }
      } else {
        console.log('No user is logged in');
        this.user = null;
        this.profileImg = 'assets/images/home/user.png';
      }
    });
  }

  attendEvent(): void { }

  logout(): void {
    this.userService.logout().subscribe(() => {
      console.log('User logged out');
      this.router.navigate(['/home']);
    });
  }
}
