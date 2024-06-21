import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { EventComponent } from './event/event.component';
import { FooterComponent } from './footer/footer.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HeaderComponent, EventComponent, FooterComponent, AngularFireAuthModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'NomadCoder';

  constructor(
    private router: Router
  ) { }

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }
}
