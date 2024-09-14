import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IHero } from '../modules/hero';
import { HeroAdvertisementComponent } from '../hero-advertisement/hero-advertisement.component';
import { WorkFlowComponent } from '../work-flow/work-flow.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [DatePipe, HeroAdvertisementComponent, WorkFlowComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroComponent implements OnInit, AfterViewInit {

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

  ngAfterViewInit(): void {
    const randomX = this.random(-400, 400);
    const randomY = this.random(-200, 200);
    const randomDelay = this.random(0, 50);
    const randomTime = this.random(6, 12);
    const randomTime2 = this.random(5, 6);
    const randomAngle = this.random(-30, 150);

    const blurs = gsap.utils.toArray('.blur');
    blurs.forEach((blur: any) => {
      gsap.set(blur, {
        x: randomX(-1),
        y: randomX(1),
        rotation: randomAngle(-1),
      });

      this.moveX(blur, 1);
      this.moveY(blur, -1);
      this.rotate(blur, 1);
    });
  }

  rotate(target: any, direction: number) {
    gsap.to(target, this.randomTime2(), {
      rotation: this.randomAngle(direction),
      ease: 'Sine.easeInOut',
      onComplete: () => this.rotate(target, direction * -1),
    });
  }

  moveX(target: any, direction: number) {
    gsap.to(target, this.randomTime(), {
      x: this.randomX(direction),
      ease: 'Sine.easeInOut',
      onComplete: () => this.moveX(target, direction * -1),
    });
  }

  moveY(target: any, direction: number) {
    gsap.to(target, this.randomTime(), {
      y: this.randomY(direction),
      ease: 'Sine.easeInOut',
      onComplete: () => this.moveY(target, direction * -1),
    });
  }

  random(min: number, max: number) {
    const delta = max - min;
    return (direction = 1) => (min + delta * Math.random()) * direction;
  }

}
