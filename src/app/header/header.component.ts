import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ResolveEnd, Router, RouterModule } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IHeader } from '../modules/header';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any;
  profileImg = 'assets/images/home/defaultUser.jpg';

  header?: IHeader;
  isQuizPageActive?: boolean;
  $routerSubscription = new Subscription();

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
          this.profileImg = 'assets/images/home/defaultUser.jpg';
        }
      } else {
        console.log('No user is logged in');
        this.user = null;
        this.profileImg = 'assets/images/home/defaultUser.jpg';
      }
    });

    this.getHeaderDetails();

    this.$routerSubscription = this.router.events.subscribe((routerData) => {
      if (routerData instanceof ResolveEnd) {
        if (routerData.url.includes('admin/quiz')) {
          this.isQuizPageActive = true;
        }
        else {
          this.isQuizPageActive = false;
        }
      }
    });
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

  ngOnDestroy(): void {
    this.$routerSubscription.unsubscribe();
  }
}
