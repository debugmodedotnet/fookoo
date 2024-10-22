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
  mobileMenuOpen = false;
  header?: IHeader;
  isQuizPageActive?: boolean;
  $routerSubscription = new Subscription();

  private firestore = inject(AngularFirestore);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
        this.profileImg = user.photoURL;

        if (this.profileImg == null) {
          this.profileImg = 'assets/images/home/defaultUser.jpg';
        }
      } else {
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
      this.header = header as IHeader;
    });
  }

  loginForTest() {
    if (this.user) {
      this.router.navigate(['/test-skills']);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/test-skills' } });
    }
  }

  logout(): void {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/home']);
      // window.location.reload();
    });
  }

  ngOnDestroy(): void {
    this.$routerSubscription.unsubscribe();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement;
    const hamburger = document.querySelector('.navbar-toggler') as HTMLElement;
    const hamburgerIcon = document.querySelector('.burger') as HTMLElement;

    if (this.mobileMenuOpen) {
      hamburger.className = "navbar-toggler border-0 opened"
      hamburgerIcon.className = "burger isOpened"
      //mobileMenu.style.visibility = 'visible';
      mobileMenu.style.display = 'flex';
      mobileMenu.style.opacity = '1';

    } else {
      hamburger.className = "navbar-toggler border-0 closed"
      hamburgerIcon.className = "burger isClosed"
      //mobileMenu.style.visibility = 'hidden';
      mobileMenu.style.display = 'none';
      mobileMenu.style.opacity = '0';
    }
  }

}
