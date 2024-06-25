import { HeroComponent } from '../hero/hero.component';
import { Component } from '@angular/core';
import { EventComponent } from '../event/event.component';
import { InstructorsComponent } from '../instructors/instructors.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, EventComponent, InstructorsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
