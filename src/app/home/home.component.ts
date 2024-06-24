import { Component } from '@angular/core';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
