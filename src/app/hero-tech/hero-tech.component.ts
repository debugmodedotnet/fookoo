import { Component, OnInit, inject } from '@angular/core';
import { ITechStack } from '../modules/techs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-hero-tech',
  standalone: true,
  imports: [],
  templateUrl: './hero-tech.component.html',
  styleUrl: './hero-tech.component.scss'
})
export class HeroTechComponent implements OnInit {

  techStack?: ITechStack[];

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.firestore.collection('homepagedata').doc('technology-stack').collection('techs').valueChanges().subscribe(techStack => {     
      this.techStack = techStack as ITechStack[];
    });
  }

}
