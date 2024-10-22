import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-verify-email-prompt',
  standalone: true,
  imports: [],
  templateUrl: './verify-email-prompt.component.html',
  styleUrl: './verify-email-prompt.component.scss'
})
export class VerifyEmailPromptComponent {

  private router = inject(Router);
  private userService = inject(UserService);

  async handleHomeClick(): Promise<void> {
    await this.userService.refreshUser();
    this.router.navigateByUrl('');
  }
}
