import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if(!user.isadmin){
        this.router.navigate(['/home']);
      }
    });
  }
  
}
