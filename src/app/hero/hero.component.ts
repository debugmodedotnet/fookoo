import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IHero } from '../modules/hero';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [DatePipe, NgFor],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit {

  hero?: IHero;
  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getHeroData();
  }

  getHeroData() {
    this.firestore.collection('homepagedata').doc('hero').valueChanges().subscribe(hero => {
      console.log("Hero:", hero);
      this.hero = hero as IHero;
    });
  }

}
