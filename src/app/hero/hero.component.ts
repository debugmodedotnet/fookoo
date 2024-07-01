import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, CommonModule } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IHero } from '../modules/hero';
import { ITechStack } from '../modules/techs';
import { IAdvertisement } from '../modules/home-ads';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, DatePipe, NgFor],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroComponent implements OnInit {

  hero?: IHero;
  advertisements?: IAdvertisement[];
  techStack?: ITechStack[];

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getHeroData();
  }

  getHeroData() {
    this.firestore.collection('homepagedata').doc('hero').valueChanges().subscribe(hero => {
      console.log("Hero:", hero);
      this.hero = hero as IHero;
    });

    this.firestore.collection('homepagedata').doc('advertisements').collection('ads-list').valueChanges().subscribe(advertisements => {
      console.log("advertisements:", advertisements);
      this.advertisements = advertisements as IAdvertisement[];
    });

    this.firestore.collection('homepagedata').doc('technology-stack').collection('techs').valueChanges().subscribe(techStack => {
      console.log("techStack:", techStack);
      this.techStack = techStack as ITechStack[];
    });
  }

}
