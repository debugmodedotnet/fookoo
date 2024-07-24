import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HeaderComponent, FooterComponent, AngularFireAuthModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'NomadCoder';
  scrollTop: HTMLElement | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setupPreloader();
    this.setupScrollTopButton();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Optional: for smooth scrolling
      });
    });
  }

  setupPreloader(): void {
    const preloader = document.querySelector('#preloader') as HTMLElement | null;
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.transition = 'opacity 0.5s ease-out';
          preloader.addEventListener('transitionend', () => {
            preloader.remove();
          });
        }, 100);
      });
    }
  }

  setupScrollTopButton(): void {
    this.scrollTop = document.querySelector('.scroll-top') as HTMLElement;

    if (this.scrollTop) {
      this.toggleScrollTop();
      window.addEventListener('scroll', () => this.toggleScrollTop());
      this.scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  toggleScrollTop(): void {
    if (this.scrollTop) {
      this.scrollTop.classList.toggle('active', window.scrollY > 100);
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }
}
