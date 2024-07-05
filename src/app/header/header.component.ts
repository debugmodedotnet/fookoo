import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IHeader } from '../modules/header';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  user: any;
  profileImg = 'assets/images/home/user.png';
  header?: IHeader;

  private firestore = inject(AngularFirestore);
  private userService = inject(UserService);
  private router = inject(Router);

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

    this.getHeaderDetails();
  }

  getHeaderDetails() {
    this.firestore.collection('layout').doc('header').valueChanges().subscribe(header => {
      console.log(header);
      this.header = header as IHeader;
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
