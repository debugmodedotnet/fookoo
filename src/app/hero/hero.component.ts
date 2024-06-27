import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, CommonModule } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IHero } from '../modules/hero';
import { ITechStack } from '../modules/techs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, DatePipe, NgFor],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, AfterViewInit {

  hero?: IHero;
  techStack?: ITechStack[];

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getHeroData();
  }

  ngAfterViewInit(): void {
    //this.setupScrollers();
  }

  getHeroData() {
    this.firestore.collection('homepagedata').doc('hero').valueChanges().subscribe(hero => {
      console.log("Hero:", hero);
      this.hero = hero as IHero;
    });

    this.firestore.collection('homepagedata').doc('technology-stack').collection('techs').valueChanges().subscribe(techStack => {
      console.log("techStack:", techStack);
      this.techStack = techStack as ITechStack[];
    });
  }

  // setupScrollers() {
  //   const scrollers: NodeListOf<Element> = document.querySelectorAll(".scroller");

  //   if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  //     scrollers.forEach((scroller: Element) => {
  //       scroller.setAttribute("data-animated", "true");

  //       const scrollerInner = scroller.querySelector(".scroller__inner");

  //       if (scrollerInner) {
  //         const children = Array.from(scrollerInner.children);
  //         const totalChildren = children.length;

  //         for (let i = 0; i < totalChildren; i++) {
  //           const duplicatedItem = children[i].cloneNode(true) as Element;
  //           duplicatedItem.setAttribute("aria-hidden", "true");
  //           scrollerInner.appendChild(duplicatedItem);
  //         }
  //       }
  //     });
  //   }
  // }

}
