import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  private userService = inject(UserService);
  user : any; 

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        console.log("User is logged in", user);
        this.user = user;
      } else {
        console.log("No user is logged in");
        this.user = null;
      }
    });
  }

  attendEvent():void{
    
  }

}
