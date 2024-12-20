import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IHero } from '../modules/hero';
import { HeroAdvertisementComponent } from '../hero-advertisement/hero-advertisement.component';
import { WorkFlowComponent } from '../work-flow/work-flow.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [DatePipe, HeroAdvertisementComponent, WorkFlowComponent, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroComponent implements OnInit {

  hero?: IHero;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getHeroData();
  }

  getHeroData() {
    this.firestore.collection('homepagedata').doc('hero').valueChanges().subscribe(hero => {
      this.hero = hero as IHero;
    });
  }

}