import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


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

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.scrollTop = document.querySelector('.scroll-top');

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
